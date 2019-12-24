import matplotlib.pyplot as plt
import stats
import sys

def DrawPie():
    codeTypes = stats.TallyCodeTypes()

    # Data to plot
    labels = list(codeTypes.keys())
    sizes = list(codeTypes.values())

    # Plot
    plt.pie(sizes, labels=labels, autopct="%1.1f%%", shadow=True, startangle=140)

    plt.axis("equal")
    plt.show()

# Draws a box plot of the lengths of each paste
def DrawBoxPlot():
    codeLengths = stats.GetCodeLengths()

    plt.boxplot(codeLengths, patch_artist=True)
    plt.title("Length of all pastes in the database")
    plt.show()

def PrintStatistics():
    print("\nPrinting Statistics...")

    codeTypes = stats.TallyCodeTypes()

    keys = list(codeTypes.keys())
    values = list(codeTypes.values())

    totalPastes = 0

    for i in range(len(keys)):
        totalPastes += values[i]

    for i in range(len(keys)):
        # Generate the percentage of that code type (Round to 2 decimal places)

        _currentPastes = values[i]

        _percentage = round(_currentPastes / float(totalPastes) * 100, 2)

        print(_percentage, "% of pastes are: ", keys[i], "(", _currentPastes, " of ", totalPastes, ")")

if(sys.argv[1] == "--nogui"):
    PrintStatistics()
else:
    DrawPie()
    DrawBoxPlot()
