import sqlite3

def ExecuteSQL(sql):
    db = sqlite3.connect("../bin/codeBlocks.db")
    cursor = db.cursor()

    cursor.execute(sql)


def ReadDatabase():
    sql_entry = "SELECT * FROM "
