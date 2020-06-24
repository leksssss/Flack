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
allchannels=[]
#Empty dictionary to store messages
messages={"username":None,"text": None,"time": None}

#Redirect to login page
@app.route("/")
@login_required
def index():
    username=session["username"]
    print(allchannels)
    return render_template("home.html",channels=allchannels,username=username)


@app.route("/join",methods=["POST","GET"])
def join():
    if request.method=='POST':
        username=request.form["username"]
        #check for unique username
        if username in users:
            return render_template("index.html",error="Username already taken!")
        else:
            #add to list of users
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

@app.route("/login",methods=["POST","GET"])
def login():
    if request.method=="POST":
        username=request.form["username"]
        if username in users:
            session['username']=username
            session.permanent=True
            return redirect("/")
        else:
            return render_template("index.html",error="You need to join first.")
    else:
        if 'username' in session:
            return redirect("/")
        else:
            return render_template("login.html")

#Log Out and clear the session cookie
@app.route("/log_out")
@login_required
def log_out():
    session.clear()
    print(allchannels)
    return redirect('/login')

#Socket listening for new channel created
@socketio.on("new channel created")
def channel(data):
    channelname=data["channelname"]
    if channelname in allchannels:
        emit('channel exists')
    else:
        session['channelname']=channelname
        session.permanent=True
        allchannels.append(channelname)
        print(allchannels)
        emit('announce channel',{"channelname":channelname}, broadcast=True)

#Deleting an account
@socketio.on("delete account")
def delete():
    username=session.get('username')
    users.remove(username)
    session.clear()
    print(username)
    print(users)
    return redirect("/login")
    #emit('user deleted',{"username":username},broadcast=True)

if __name__=='__main__':
    socketio.run(app)