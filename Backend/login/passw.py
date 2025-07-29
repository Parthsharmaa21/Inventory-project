import bcrypt

password = "1324".encode("utf-8") #parth admin1
#password = "2345".encode("utf-8") #admin2
#password = "3456".encode("utf-8") #admin3

#password = "1234".encode("utf-8")  # john user1
#password = "4321".encode("utf-8")  # vaibhav user2
#password = "6543".encode("utf-8")  # rishita user3
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed.decode("utf-8"))