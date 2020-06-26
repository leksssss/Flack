def main():
    data={}
    students=[]
    details={}
    clas="class1"
    details["name"]="lekha"
    details["age"]="18"
    students.append(details)
    data[clas]=students
    students=[]
    clas="2"
    details={}
    details["name"]="pooja"
    details["age"]="18"
    #students.append(details)
    #if not data[clas]:
    students.append(details)
    data[clas]=students

    print(data)

if __name__=="__main__":
    main()