import os
import datetime
import collections

from flask import Flask,render_template,request,url_for,redirect,flash,session
from flask_socketio import SocketIO, emit,join_room,leave_room
from login_req import login_required

#Set up secret key
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


#Empty list to store all usernames  and channels
users=[]
userslogged=[]
allchannels=[]
#Empty list of dictionaries to store messages
#channelMessages={"channel":None,"msgs":[{"name":None,"time":None,"msg":None}]}
channelMessages=collections.defaultdict(list)


#Redirect to home page if logged in
@app.route("/")
@login_required
def index():
    username=session["username"]
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
            userslogged.append(username)
            session['username']=username
            #Remember the user even if browser is closed
            session.permanent=True
            return redirect ("/")
    else:
        if 'username' in session:
            return redirect("/")
        else:
            return render_template("index.html")

#Login page if account exists
@app.route("/login",methods=["POST","GET"])
def login():
    if request.method=="POST":
        username=request.form["username"]
        if username in users:
            session['username']=username
            userslogged.append(username)
            session.permanent=True
            return redirect("/")
        else:
            return render_template("index.html",error="You need to join first.")
    else:
        if 'username' in session:
            return redirect("/")
        else:
            return render_template("login.html")


#creating new channel
@app.route("/create",methods=["POST","GET"])
@login_required
def create():
    if request.method=="POST":
        channelname=request.form["channelname"]
        if channelname in allchannels:
            username=session.get('username')
            return render_template("home.html",error="Channel already exists. Choose another name.",channels=allchannels,username=username)
        else:
            allchannels.append(channelname)
            session["channelname"]=channelname
            session.permanent=True
            return redirect(url_for('info',cur_channel=channelname))
    else:
        return redirect("/")

#Redirecting to the specific channel
@app.route("/channels/<string:cur_channel>",methods=["POST","GET"])
@login_required
def info(cur_channel):
    channel=cur_channel
    username=session.get('username')    
    return render_template("home.html",username=username,channels=allchannels,cur_channel=channel,channelMessages=channelMessages[cur_channel])
    
    

#Log Out and clear the session cookie
@app.route("/log_out")
@login_required
def log_out():
    username=session.get('username')
    #userslogged.remove(username)
    session.clear()
    return redirect('/login')

#Deleting user account
@app.route("/delete")
@login_required
def delete():
    username=session.get('username')
    userslogged.remove(username)
    users.remove(username)
    print(username)
    print(users)
    session.clear()
    return redirect('/login')

@socketio.on('join')
def on_join(data):
    username = session.get('username')
    room = data['room']
    join_room(room)
    emit('join event',{"username":username,"room":room},broadcast=True)

@socketio.on('leave')
def on_leave(data):
    username = session.get('username')
    room = data['room']
    leave_room(room)
    emit('leave event',{"username":username,"room":room},broadcast=True)

#When a message is sent by user, broadcast it to everyone in the room
@socketio.on('msg sent')
def message(data):
    channel=data["ch"]
    x=datetime.datetime.now()
    time=x.strftime("%c")
    content={}
    content['name']=session.get('username')
    content['time']=time
    content['msg']=data["text"]
    channelMessages[channel].append(content)
    emit('new message',content,broadcast=True)



if __name__=="__main__":
    socketio.run(app)