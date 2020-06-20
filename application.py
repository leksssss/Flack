import os

from flask import Flask,render_template,request,url_for,redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("")
@app.route("/login",methods=["POST"])
def login():
    if request.method==POST:
        username=request.form["username"]