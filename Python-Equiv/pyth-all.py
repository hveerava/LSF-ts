from flask import Flask, render_template, request
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)

# Sample HTML file
@app.route('/')
def index():
    return render_template('index.html')

# Function to generate plots for func1
def func1(x_data, y_data, x_error, y_error):
    plt.errorbar(x_data, y_data, xerr=x_error, yerr=y_error, fmt='o')
    plt.savefig('static/image1.jpeg')
    plt.close()

# Function to generate plots for func2
def func2(x_data, y_data, x_error, y_error):
    plt.errorbar(x_data, y_data, xerr=x_error, yerr=y_error, fmt='o')
    plt.savefig('static/image2.jpeg')
    plt.close()

@app.route('/add_row', methods=['POST'])
def add_row():
    rows = request.form.get('rows', 1)
    if rows == '':
        rows = 1
    else:
        rows = int(rows) + 1
    return render_template('index.html', rows=rows)

@app.route('/delete_row', methods=['POST'])
def delete_row():
    rows = max(int(request.form.get('rows', 1)) - 1, 1)
    return render_template('index.html', rows=rows)

@app.route('/run_func1', methods=['POST'])
def run_func1():
    try:
        print(request.form)  # Print form data
        # Get number of rows
        rows = int(request.form.get('rows', 1))

        # Initialize empty lists to store data
        x_data = []
        y_data = []
        x_error = []
        y_error = []

        # Iterate through form data to extract values
        for i in range(rows):
            x_data_str = request.form.get(f'x_data_{i}')
            y_data_str = request.form.get(f'y_data_{i}')
            x_error_str = request.form.get(f'x_error_{i}')
            y_error_str = request.form.get(f'y_error_{i}')

            if x_data_str is None or y_data_str is None or x_error_str is None or y_error_str is None:
                raise ValueError("One or more form fields are missing.")

            x_data.append(float(x_data_str))
            y_data.append(float(y_data_str))
            x_error.append(float(x_error_str))
            y_error.append(float(y_error_str))

        # Run func1
        func1(x_data, y_data, x_error, y_error)

        # Print arrays
        print("X Data:", x_data)
        print("Y Data:", y_data)
        print("X Error:", x_error)
        print("Y Error:", y_error)

        return render_template('index.html', rows=rows)
    except Exception as e:
        return str(e)


@app.route('/run_func2', methods=['POST'])
def run_func2():
    try:
        # Get number of rows
        rows = int(request.form.get('rows', 1))

        # Initialize empty lists to store data
        x_data = []
        y_data = []
        x_error = []
        y_error = []

        # Iterate through form data to extract values
        for i in range(rows):
            x_data_str = request.form.get(f'x_data_{i}')
            y_data_str = request.form.get(f'y_data_{i}')
            x_error_str = request.form.get(f'x_error_{i}')
            y_error_str = request.form.get(f'y_error_{i}')

            if x_data_str is None or y_data_str is None or x_error_str is None or y_error_str is None:
                raise ValueError("One or more form fields are missing.")

            x_data.append(float(x_data_str))
            y_data.append(float(y_data_str))
            x_error.append(float(x_error_str))
            y_error.append(float(y_error_str))

        # Run func2
        func2(x_data, y_data, x_error, y_error)

        # Print arrays
        print("X Data:", x_data)
        print("Y Data:", y_data)
        print("X Error:", x_error)
        print("Y Error:", y_error)

        return render_template('index.html', rows=rows)
    except Exception as e:
        return str(e)


if __name__ == '__main__':
    app.run(debug=True, port=8080)
