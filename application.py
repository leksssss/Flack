import os

from flask import Flask,render_template,request,url_for,redirect,flash,session
from flask_socketio import SocketIO, emit
from login_req import login_required

#Set up secret key
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


#Empty list to store all usernames  and channels
users=[]
channels=[]
#Empty dictionary to store messages
messages={"username":None,"text": None,"time": None}

#Redirect to login page
@app.route("/")
@login_required
def index():
    return render_template("home.html",channels=channels)


@app.route("/login",methods=["POST","GET"])
def login():
    if request.method=='POST':
        username=request.form["username"]
        #check for unique username
        if username in users:
            return render_template("index.html",error="Username already taken!")
        else:
            users.append(username)
            print(users)
            session['username']=username
            #Remember the user even if browser is closed
            session.permanent=True
            return redirect ("/")
    else:
        if 'username' in session:
            return redirect("/")
        else:
            return render_template("index.html")

#Log Out and clear the session cookie
@app.route("/log_out")
@login_required
def log_out():
    session.clear()
    return redirect('/login')

if __name__=='__main__':
    socketio.run(app)