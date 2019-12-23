import sqlite3

def ExecuteSQL(sql):
    db = sqlite3.connect("../codeBlocks.db")
    cursor = db.cursor()

    data = cursor.execute(sql).fetchall()

    db.close()

    return data;


def ReadDatabase():
    sql_entry = "SELECT * FROM codeBlocks";

    data = ExecuteSQL(sql_entry);

    for i in data:
        print(i);

ReadDatabase();
