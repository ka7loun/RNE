from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import unicodedata

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

def has_only_allowed_chars(name):
    return bool(re.fullmatch(r"[a-zA-Z0-9\u0600-\u06FF\u0590-\u05FF\s&\-]+", name))

def is_not_only_digits(name):
    return not name.strip().isdigit()

def normalize(text):
    # Step 1: Remove accents, lowercase
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode("utf-8")
    text = text.lower()
    # Step 2: Reduce character repetitions ("hoooe" -> "hoe")
    text = re.sub(r'(.)\1{2,}', r'\1', text)  # keeps 1 of >2 repeated chars
    # Optional Step 3: Remove non-alphanum (keep letters, digits, space)
    text = re.sub(r'[^\w\s]', '', text)
    return text

def contains_bad_words(name, blacklist):
    clean_name = normalize(name)
    return any(bad in clean_name for bad in blacklist)

# Example blacklist (update as needed)
BLACKLIST = [
    "baiser", "bander", "bigornette", "bite", "bitte", "bloblos", "bordel", "bourré", "bourrée", "brackmard", "branlage", "branler", "branlette", "branleur", "branleuse", "brouter le cresson", "caca", "chatte", "chiasse", "chier", "chiottes", "clito", "clitoris", "con", "connard", "connasse", "conne", "couilles", "cramouille", "cul", "déconne", "déconner", "emmerdant", "emmerder", "emmerdeur", "emmerdeuse", "enculé", "enculée", "enculeur", "enculeurs", "enfoiré", "enfoirée", "étron", "fille de pute", "fils de pute", "folle", "foutre", "gerbe", "gerber", "gouine", "grande folle", "grogniasse", "gueule", "jouir", "la putain de ta mère", "MALPT", "ménage à trois", "merde", "merdeuse", "merdeux", "meuf", "nègre", "negro", "nique ta mère", "nique ta race", "palucher", "pédale", "pédé", "péter", "pipi", "pisser", "pouffiasse", "pousse-crotte", "putain", "pute", "ramoner", "sac à foutre", "sac à merde", "salaud", "salope", "suce", "tapette", "tanche", "teuch", "tringler", "trique", "troncher", "trou du cul", "turlute", "zigounette", "zizi",
    # previously added
    "fuck", "hoe", "shit", "zbi", "قحبة"
]

@app.route('/api/filter', methods=['POST'])
def filter_input():
    data = request.json
    user_input = data.get('input', '')
    # Apply filters
    if not has_only_allowed_chars(user_input):
        return jsonify({'filtered': user_input, 'is_valid': False, 'message': 'Le nom contient des caractères non autorisés.'})
    if not is_not_only_digits(user_input):
        return jsonify({'filtered': user_input, 'is_valid': False, 'message': 'Le nom ne doit pas être composé uniquement de chiffres.'})
    if contains_bad_words(user_input, BLACKLIST):
        return jsonify({'filtered': user_input, 'is_valid': False, 'message': 'Le nom contient des mots interdits.'})
    return jsonify({'filtered': user_input, 'is_valid': True, 'message': 'Le nom est valide !'})

if __name__ == '__main__':
    app.run(debug=True) 