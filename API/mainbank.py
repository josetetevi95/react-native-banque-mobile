from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug.wrappers import Response as WerkzeugResponse
from datetime import datetime as dt
import json
import mysql.connector
import random
import string
import datetime

# Configuration de la base de données
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'banking_system'
}

# Fonction pour générer un IBAN
def generate_iban():
    return 'FR' + ''.join(random.choices(string.digits, k=30))

# Fonction pour enregistrer un nouvel utilisateur
def register_user(post_data):
    user = json.loads(post_data)
    user['iban'] = generate_iban()
    user['solde'] = 300
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (nom, prenom, email, password, solde, iban) VALUES (%s, %s, %s, %s, %s, %s)',
            (user['nom'], user['prenom'], user['email'], user['password'], user['solde'], user['iban'])
        )
        conn.commit()
        user['id'] = cursor.lastrowid
        cursor.close()
        conn.close()
        del user['password']
        return 201, user
    except mysql.connector.Error as err:
        return 500, {'error': str(err)}

# Fonction pour se connecter
def login_user(post_data):
    login_data = json.loads(post_data)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            'SELECT * FROM users WHERE email = %s AND password = %s',
            (login_data['email'], login_data['password'])
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            del user['password']
            return 200, {'success': True, 'user': user}
        else:
            return 404, {'error': 'Invalid email or password'}
    except mysql.connector.Error as err:
        return 500, {'error': str(err)}


# Fonction pour effectuer un virement
def make_transfer(post_data):
    transfer_data = json.loads(post_data)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Vérifier l'existence du sender_iban dans la table users et récupérer le solde
        cursor.execute("SELECT solde FROM users WHERE iban = %s", (transfer_data['sender_iban'],))
        sender_solde = cursor.fetchone()
        if not sender_solde:
            return 404, {'error': 'Sender IBAN not found'}
        sender_solde = float(sender_solde[0])  # Convertir en float
        

        # Vérifier l'existence du receiver_iban dans la table users
        cursor.execute("SELECT * FROM users WHERE iban = %s", (transfer_data['receiver_iban'],))
        receiver_exists = cursor.fetchone()


        # Vérifier si le solde de l'expéditeur est suffisant
        transfer_amount = float(transfer_data['amount'])  # Convertir en float
        if sender_solde < transfer_amount:
            return 400, {'error': 'Insufficient funds'}

        # Insérer la transaction dans la table transactions
        if receiver_exists is not None:
            cursor.execute(
                'INSERT INTO transactions (sender_iban, receiver_iban, amount) VALUES (%s, %s, %s)',
                (transfer_data['sender_iban'], transfer_data['receiver_iban'], transfer_amount,)
            )
        else:
            
            cursor.execute(
                'INSERT INTO transactions (sender_iban, receiver_iban, amount) VALUES (%s, %s, %s)',
                (transfer_data['sender_iban'], transfer_data['receiver_iban'], transfer_amount,)
            )

        # Mettre à jour le solde de l'expéditeur
        cursor.execute(
            'UPDATE users SET solde = solde - %s WHERE iban = %s',
            (transfer_amount, transfer_data['sender_iban'],)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return 200, {'success': True, 'message': 'Transfer successful'}

    except mysql.connector.Error as err:
        return 500, {'error': str(err)}


# Fonction pour commander un chéquier
def order_checkbook(user_iban, checkbook_type):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Vérifier le solde de l'utilisateur
        cursor.execute('SELECT solde FROM users WHERE iban = %s', (user_iban,))
        solde = cursor.fetchone()[0]
        if solde >= 15.00:
            # Ajouter la demande de chéquier dans la table checkbook_requests
            cursor.execute(
                'INSERT INTO checkbook_requests (user_iban, checkbook_type) VALUES (%s, %s)',
                (user_iban, checkbook_type)
            )

            # Mettre à jour le solde de l'utilisateur
            cursor.execute('UPDATE users SET solde = solde - 15.00 WHERE iban = %s', (user_iban,))

            conn.commit()
            cursor.close()
            conn.close()
            return 200, {'message': 'Checkbook ordered'}
        else:
            return 400, {'error': 'Insufficient funds'}
    except mysql.connector.Error as err:
        return 500, {'error': str(err)}

# Fonction pour obtenir les informations d'un utilisateur par son ID
def get_user_info(user_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id, nom, prenom, email, iban, solde FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            return 200, {'success': True, 'user': user}
        else:
            return 404, {'success': False, 'message': 'Utilisateur non trouvé'}
    except mysql.connector.Error as err:
        return 500, {'success': False, 'error': str(err)}
    

# Fonction pour convertir les objets datetime en chaînes de caractères
def datetime_to_str(transaction):
    if 'transaction_date' in transaction and isinstance(transaction['transaction_date'], dt):
        transaction['transaction_date'] = transaction['transaction_date'].strftime('%Y-%m-%d %H:%M:%S')
    return transaction

# Fonction pour lister les transactions d'un utilisateur
def list_transactions(sender_iban):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT t.*, u.nom, UPPER(LEFT(u.prenom, 1)) AS prenom_initial
            FROM transactions t
            LEFT JOIN users u ON t.sender_iban = u.iban
            WHERE t.sender_iban = %s OR t.receiver_iban = %s
        ''', (sender_iban, sender_iban))
        transactions = cursor.fetchall()
        cursor.close()
        conn.close()

        formatted_transactions = []
        for transaction in transactions:
            transaction = datetime_to_str(transaction)  # Convertir les datetime en chaînes de caractères
            amount = transaction['amount']
            if transaction['sender_iban'] == sender_iban:
                transaction['amount'] = '-' + str(amount)
            else:
                transaction['amount'] = '+' + str(amount)
            formatted_transactions.append(transaction)

        return 200, {'success': True, 'transactions': formatted_transactions}
    except mysql.connector.Error as err:
        return 500, {'success': False, 'error': str(err)}

# Fonction pour ajouter des fonds sur le compte d'un utilisateur
def add_funds(user_id, amount):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET solde = solde + %s WHERE id = %s', (amount, user_id))
        conn.commit()
        cursor.close()
        conn.close()
        return 200, {'success': True, 'message': 'Funds added successfully'}
    except mysql.connector.Error as err:
        return 500, {'success': False, 'error': str(err)}

# Routes POST
def handle_register_user(request):
    post_data = request.get_data(as_text=True)
    status, response = register_user(post_data)
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

def handle_login_user(request):
    post_data = request.get_data(as_text=True)
    status, response = login_user(post_data)
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

def handle_make_transfer(request):
    post_data = request.get_data(as_text=True)
    status, response = make_transfer(post_data)
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

# Route pour commander un chéquier
def handle_order_checkbook(request):
    post_data = request.get_data(as_text=True)
    data = json.loads(post_data)
    user_iban = data.get('user_iban')
    checkbook_type = data.get('checkbook_type')
    status, response = order_checkbook(user_iban, checkbook_type)
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))


def handle_list_transactions(request):
    post_data = request.get_data(as_text=True)
    user_data = json.loads(post_data)
    status, response = list_transactions(user_data['sender_iban'])
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

def handle_add_funds(request):
    post_data = request.get_data(as_text=True)
    fund_data = json.loads(post_data)
    status, response = add_funds(fund_data['user_id'], fund_data['amount'])
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

def handle_get_user_info(request, id):
    status, response = get_user_info(id)
    return add_cors_headers(Response(json.dumps(response), status=status, mimetype='application/json'))

def handle_test_route(request):
    static_data = {
        'message': 'This is a test route',
        'status': 'success',
        'data': [1, 2, 3, 4, 5]
    }
    return add_cors_headers(Response(json.dumps(static_data), status=200, mimetype='application/json'))

# URL Mapping
url_map = Map([
    Rule('/api/users/register', endpoint='register_user', methods=['POST', 'OPTIONS']),
    Rule('/api/users/login', endpoint='login_user', methods=['POST', 'OPTIONS']),
    Rule('/api/transfer', endpoint='make_transfer', methods=['POST', 'OPTIONS']),
    Rule('/api/checkbook', endpoint='order_checkbook', methods=['POST', 'OPTIONS']),
    Rule('/api/order_checkbook', endpoint='order_checkbook', methods=['POST', 'OPTIONS']),
    Rule('/api/transactions', endpoint='list_transactions', methods=['POST', 'OPTIONS']),
    Rule('/api/add_funds', endpoint='add_funds', methods=['POST', 'OPTIONS']),
    Rule('/api/users/<int:id>', endpoint='get_user_info', methods=['GET', 'OPTIONS']),
    Rule('/api/test', endpoint='test_route', methods=['GET', 'OPTIONS'])  # Nouvelle route de test
])

def application(environ, start_response):
    request = Request(environ)
    urls = url_map.bind_to_environ(environ)
    try:
        endpoint, args = urls.match()
        if request.method == 'OPTIONS':
            response = handle_options(request)
        else:
            response = dispatch_request(request, endpoint, args)
    except HTTPException as e:
        response = e
    if isinstance(response, WerkzeugResponse):
        response = add_cors_headers(response)
    return response(environ, start_response)

def dispatch_request(request, endpoint, args):
    if endpoint == 'register_user':
        response = handle_register_user(request)
    elif endpoint == 'login_user':
        response = handle_login_user(request)
    elif endpoint == 'make_transfer':
        response = handle_make_transfer(request)
    elif endpoint == 'order_checkbook':
        response = handle_order_checkbook(request)
    elif endpoint == 'list_transactions':
        response = handle_list_transactions(request)
    elif endpoint == 'add_funds':
        response = handle_add_funds(request)
    elif endpoint == 'get_user_info':
        response = handle_get_user_info(request, **args)
    elif endpoint == 'test_route':
        response = handle_test_route(request)
    else:
        response = Response('Not Found', status=404)
    return response

# Gestion des en-têtes CORS
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# Fonction de gestion des requêtes OPTIONS pour CORS
def handle_options(request):
    response = Response(status=200)
    return add_cors_headers(response)

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('127.0.0.1', 7000, application)
