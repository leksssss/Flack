import collections
def main():
    channelMessages=collections.defaultdict(list)
    content={}
    username="lekha"
    time="00:50"
    msg="hi d"
    channelname="ch1"
    content['name']=username
    content['time']=time
    content['msg']=msg
    channelMessages[channelname].append(content)
    content={}
    username="leks"
    time="00:50"
    msg="hi da"
    channelname="ch1"
    content['name']=username
    content['time']=time
    content['msg']=msg
    channelMessages[channelname].append(content)
    chat=(channelMessages[channelname])
    for m in chat:
        print(m["name"])
        print(m["time"])
        print(m["msg"])

if __name__=="__main__":
    main()
