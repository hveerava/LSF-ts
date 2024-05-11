from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    xdata =[]
    ydata=[]
    xerr =[]
    yerr =[]

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

        for i in range(len(xdata)):
            xdata[i] = float(xdata[i])
            ydata[i] = float(ydata[i])
            xerr[i] = float(xerr[i])
            yerr[i] = float(yerr[i])

        return render_template('result.html', xdata=xdata, ydata=ydata, xerr=xerr, yerr=yerr)
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port='8080')
