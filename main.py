from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import login_required, logout_user, current_user, login_user, LoginManager, UserMixin

# META VARIABLES
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quizzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "thisisasecret"
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


# GET CURRENT YEAR
@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}


# DATABASE TABLES
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=False, nullable=False)
    author = db.Column(db.String(50), unique=False, nullable=False)
    thumbnail = db.Column(db.String(800), unique=False, nullable=False)
    total_questions = db.Column(db.Integer, unique=False, nullable=False)
    questions = db.Column(db.PickleType, unique=False, nullable=False)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)


db.create_all()


# AUTHENTICATION
@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        return User.query.get(user_id)
    return None


@login_manager.unauthorized_handler
def unauthorized():
    return render_template("unautharized.html")


# ROUTES
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        
        # Check if user exists
        if user:
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("dashboard"))
            else:
                # Redirect to login_page if credentials are invalid
                flash("Invalid Username or Password", "danger")
                return redirect(url_for('login_page'))       
        else:
            flash("That username does not exist. Sign up instead.", "danger")
            return redirect(url_for('create_account'))
        
    return render_template("login.html")


@app.route("/create-account", methods=["GET", "POST"])
def create_account():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        retyped_password = request.form["retype-password"]
        
        if password == retyped_password:
            if not User.query.filter_by(username=username).first():
                new_user = User(username=username, password=generate_password_hash(password, method="sha256", salt_length=8))
                db.session.add(new_user)
                db.session.commit()
                
                login_user(new_user)
                return redirect(url_for("dashboard"))
            else:
                flash("That user already exists! Log in instead.", "danger")
                return redirect(url_for('login_page'))
        else:
            flash("Passwords do not match!")    
            return redirect(url_for('create_account'))
    
    return render_template("create-account.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


@app.route("/dashboard")
@login_required
def dashboard():
    own_quizes = Quiz.query.filter_by(author=current_user.username).all()
    return render_template("dashboard.html", is_dashboard=True, own_quizes=own_quizes)


@app.route("/browse")
def browse():
    return render_template("browse.html", quizes=Quiz.query.all())


@app.route("/create", methods=["GET", "POST"])
@login_required
def create():
    if request.method == "POST":
        name = request.form["quiz_name"]
        thumbnail = request.form["thumbnail"]
        author = current_user.username
        if thumbnail.strip() == "":
            thumbnail = "https://cdn.pixabay.com/photo/2017/07/10/23/43/question-mark-2492009_960_720.jpg"
        return redirect(url_for("create_questions", name=name, thumbnail=thumbnail, author=author))
        # name = request.form["quiz_name"]
        # thumbnail = request.form["thumbnail"]
        # author = User.query.get(int(current_user.get_id())).username
        # if thumbnail.strip() == "":
            # thumbnail = "https://cdn.pixabay.com/photo/2017/07/10/23/43/question-mark-2492009_960_720.jpg"
        # new_quiz = Quiz(name=name, thumbnail=thumbnail, author=author)
        # db.session.add(new_quiz)
        # db.session.commit()
        # return render_template("success.html", year=year, logged_in=True)
    return render_template("create.html")


@app.route("/create-questions", methods=["GET", "POST"])
@login_required
def create_questions():
    if request.method == "GET":
        name = request.args.get("name")
        thumbnail = request.args.get("thumbnail")
        author = request.args.get("author")
        if current_user.username != author:
            return render_template("notfound.html"), 404
        return render_template("create-questions.html") 
    

@app.route("/quiz/<int:id>")
@login_required
def start_quiz(id):
    quiz = Quiz.query.get(id)
    if quiz:
        return render_template("quiz_cover.html", quiz=quiz)
    else:
        return render_template("notfound.html"), 404


# Error Handling
@app.errorhandler(404)
def not_found(e):
    return render_template("notfound.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
