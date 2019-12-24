import matplotlib.pyplot as plt
import stats

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


DrawPie()
#DrawBoxPlot()
