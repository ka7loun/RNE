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
    # Lowercase
    text = text.lower()
    # Reduce character repetitions ("hoooe" -> "hoe")
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    # Remove non-alphanum (keep letters, digits, space)
    text = re.sub(r'[^\w\s]', '', text)
    return text

def contains_bad_words(name, blacklist):
    clean_name = normalize(name)
    return any(bad in clean_name for bad in blacklist)

def detect_script(char):
    # Returns a string representing the script of the character
    codepoint = ord(char)
    if 0x0600 <= codepoint <= 0x06FF or 0x0750 <= codepoint <= 0x077F:  # Arabic
        return 'arabic'
    elif 0x0041 <= codepoint <= 0x007A or 0x00C0 <= codepoint <= 0x00FF:  # Latin
        return 'latin'
    elif 0x0400 <= codepoint <= 0x04FF:  # Cyrillic
        return 'cyrillic'
    elif 0x0590 <= codepoint <= 0x05FF:  # Hebrew
        return 'hebrew'
    # Add more scripts if needed
    return 'other'

def is_single_script(text):
    scripts = set()
    for char in text:
        if char.isalpha():
            scripts.add(detect_script(char))
    # Remove 'other' from the set
    scripts.discard('other')
    return len(scripts) <= 1

# Example blacklist (update as needed)
BLACKLIST = [
    # English
    "fuck", "shit", "bitch", "ass", "asshole", "bastard", "damn", "dick", "cunt", "fag", "faggot", 
    "nigger", "nigga", "slut", "whore", "pussy", "cock", "jerk", "cum", "dildo", "blowjob", 
    "porn", "sexy", "sex", "vagina", "penis", "boobs", "tits", "milf", "gay", "lesbian", "rape", 
    "orgy", "anal", "rimjob", "handjob", "masturbate", "suck", "sucking", "screwing", "humping",

    # French
    "putain", "salope", "con", "connard", "connasse", "enculé", "encule", "bite", "chatte", "nique", 
    "ta mère", "branleur", "merde", "cul", "bordel", "pd","zebi",

    # Arabic (select common obscenities)
    "قحبة", "عرص", "كس", "زب", "طيز", "سكس", "شرموطة", "لوطي", "نيك"
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
    if not is_single_script(user_input):
        return jsonify({'filtered': user_input, 'is_valid': False, 'message': 'Le nom ne doit pas contenir plusieurs langues ou alphabets.'})
    return jsonify({'filtered': user_input, 'is_valid': True, 'message': 'Le nom est valide !'})

if __name__ == '__main__':
    app.run(debug=True)
