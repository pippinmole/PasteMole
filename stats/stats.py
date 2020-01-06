import sqlite3

# codeBlocks = ["url", "name", "description", "code", "codeType"]
codeData = []

def ExecuteSQL(sql):
    db = sqlite3.connect("../bin/codeBlocks.db")
    cursor = db.cursor()

    data = cursor.execute(sql).fetchall()

    db.close()

    return data;


def ReadDatabase():
    global codeData

    sql_entry = "SELECT * FROM codeBlocks";

    data = ExecuteSQL(sql_entry);

    for i in data:
        codeData.append(i)

ReadDatabase();

# Returns { "plain_text" : 5, "c_cpp" : 1 };
def TallyCodeTypes():

    dict = { };

    for i in codeData:
        codeType = i[4]

        if codeType in dict:
            dict[codeType] += 1
        else:
            dict[codeType] = 1

    return dict

def GetCodeLengths():
    lengths = []

    for i in codeData:
        _length = len(i[3])
        lengths.append(_length)

    return lengths
