from flask import Flask, render_template, request
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    xdata =[]
    ydata=[]
    xerr =[]
    yerr =[]
    '''names = []
    emails = []
    phones = []
    addresses = []'''

    if request.method == 'POST':
        form_data = request.form
        for key, value in form_data.items():
            field, index = key.split('_')
            index = int(index)
            if field == 'xdata':
                xdata.append(value)
            elif field == 'ydata':
                ydata.append(value)
            elif field == 'xerr':
                xerr.append(value)
            elif field == 'yerr':
                yerr.append(value)
        '''print(xdata)
        print(ydata)
        print(xerr)
        print(yerr)'''
        # ylsf stuff slow integration
        for i in range(len(xdata)):
            xdata[i] = float(xdata[i])
            ydata[i] = float(ydata[i])
            xerr[i] = float(xerr[i])
            yerr[i] = float(yerr[i])

        '''plt.errorbar(xdata, ydata, yerr=yerr, fmt='o', label='Data')

        # Fit a best fit line (linear regression) to the data
        coefficients = np.polyfit(xdata, ydata, 1)
        best_fit_line = np.poly1d(coefficients)
        x_values = np.linspace(min(xdata), max(xdata), 100)
        plt.plot(x_values, best_fit_line(x_values), label='Best Fit Line')

        plt.xlabel('X')
        plt.ylabel('Y')
        plt.title('Best Fit Line with Error Bars')
        plt.legend()
        plt.grid(True)
        plt.savefig('image1.jpeg')'''

        return render_template('result.html', xdata=xdata, ydata=ydata, xerr=xerr, yerr=yerr)
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port='8080')
