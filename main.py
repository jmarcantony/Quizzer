import datetime
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
year = datetime.date.today().year


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
    username = db.Column(db.String(100))
    password = db.Column(db.String(100))


db.create_all()


# AUTHENTICATION
@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        return User.query.get(user_id)
    return None


@login_manager.unauthorized_handler
def unauthorized():
    return render_template("unautharized.html", year=year)


# ROUTES
@app.route("/")
def home():
    is_logged_in = current_user.is_authenticated
    return render_template("index.html", year=year, logged_in=is_logged_in)


@app.route("/login", methods=["GET", "POST"])
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "GET":
        return render_template("login.html", year=year)
    else:
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        
        # Check if user exists and credentials are valid
        if user:
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("dashboard"))
        
        # Redirect to login_page if user does not exist or credentials are invalid
        flash("Invalid Username or Password", "danger")
        return redirect(url_for('login_page'))


@app.route("/browse")
def browse():
    quizes = Quiz.query.all()
    is_logged_in = current_user.is_authenticated
    return render_template("browse.html", year=year, quizes=quizes, logged_in=is_logged_in)


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
                flash("User already exists!", "danger")
        else:
            flash("Passwords do not match!")    
        return redirect(url_for('create_account'))
    
    return render_template("create-account.html", year=year)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


@app.route("/dashboard")
@login_required
def dashboard():
    user = User.query.get(int(current_user.get_id()))
    username = user.username
    own_quizes = Quiz.query.filter_by(author=username).all()
    return render_template("dashboard.html", year=year, is_dashboard=True, logged_in=True, user=user, own_quizes=own_quizes)


@app.route("/create", methods=["GET", "POST"])
@login_required
def create():
    if request.method == "GET":
        is_logged_in = current_user.is_authenticated
        return render_template("create.html", year=year, logged_in=is_logged_in)
    else:
        name = request.form["quiz_name"]
        thumbnail = request.form["thumbnail"]
        author = User.query.get(int(current_user.get_id())).username
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


@app.route("/create-questions", methods=["GET", "POST"])
@login_required
def create_questions():
    if request.method == "GET":
        is_logged_in = current_user.is_authenticated
        name = request.args.get("name")
        thumbnail = request.args.get("thumbnail")
        author = request.args.get("author")
        if User.query.get(int(current_user.get_id())).username != author:
            return render_template("notfound.html", year=year, logged_in=is_logged_in), 404
        return render_template("create-questions.html", year=year, logged_in=is_logged_in) 
    

@app.route("/quiz/<int:id>")
@login_required
def start_quiz(id):
    is_logged_in = current_user.is_authenticated
    quiz = Quiz.query.get(id)
    if quiz:
        return render_template("quiz_cover.html", year=year, logged_in=is_logged_in, quiz=quiz)
    else:
        return render_template("notfound.html", year=year, logged_in=is_logged_in), 404


# Error Handling
@app.errorhandler(404)
def not_found(e):
    is_logged_in = current_user.is_authenticated
    return render_template("notfound.html", year=year, logged_in=is_logged_in), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
