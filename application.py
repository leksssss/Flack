import os

from flask import Flask,render_template,request,url_for,redirect,flash
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users=[]

@app.route("/",methods=["POST","GET"])
def index():
    if request.method=='POST':
        username=request.form["username"]
        if username in users:
            return render_template("index.html",error="Username already taken")
        else:
            users.append(username)
            print(users)
            return render_template("home.html")
    return render_template("index.html")


@app.route("/login",methods=["POST"])
def home():
    return 


if __name__=='__main__':
    socketio.run(app)