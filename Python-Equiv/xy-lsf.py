import numpy as np
import matplotlib.pyplot as plt

def xylsf():
    # Generate some sample data
    x = np.array([1, 2, 3, 4, 5]) # REPLACE WITH X DATA
    y = np.array([2, 3, 4, 5, 6]) # REPLACE WITH Y DATA
    # Define different error bars for each point
    x_err = np.array([0.1, 0.2, 0.1, 0.3, 0.2]) # REPLACE WITH X ERROR DATA
    y_err = np.array([0.1, 0.2, 0.1, 0.3, 0.2]) # REPLACE WITH Y ERROR DATA

    # Plot the data points with error bars
    plt.errorbar(x, y, xerr=x_err, yerr=y_err, fmt='o', label='Data')

    # Fit a best fit line (linear regression) to the data
    coefficients = np.polyfit(x, y, 1)
    best_fit_line = np.poly1d(coefficients)
    x_values = np.linspace(min(x - x_err), max(x + x_err), 100)
    plt.plot(x_values, best_fit_line(x_values), label='Best Fit Line')

    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title('Best Fit Line with Error Bars')
    plt.legend()
    plt.grid(True)
    plt.savefig('image2.jpeg')

xylsf()