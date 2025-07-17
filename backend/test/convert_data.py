import json  
with open("./roommates_new.json",'r') as f:
    data=json.loads(f.read())
with open("./room_mates_new.json","w") as f:
    new_data={}
    for i in data:
        new_data[i["room"]]={"roommates":i["roommates"]}
    f.write(json.dumps(new_data))
        
        
