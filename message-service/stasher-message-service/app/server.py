from crypt import methods
from flask import Flask, request
from flask_mail import Mail, Message
from converter import convertHTML
import os

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'example@gmail.com'
app.config['MAIL_PASSWORD'] = 'tvdtuvdrcpmukwbh'
mail = Mail(app)

@app.route('/api/mail', methods = ['POST'])
def sendMail():
	try: 
		data = request.json
		msg = Message(data['header'], sender = os.getenv('USERNAME'), recipients = [data['recipient']])
		msg.body = data['body']
		msg.html = data['html']
		mail.send(msg)
		return 'Email sent.'
	except Exception as ex:
		print(ex, flush=True)
		print(type(ex))
		return 'Error'

@app.route('/api/mail/balance', methods = ['POST'])
def sendMailBalance():
	try: 
		data = request.json
		msg = Message(data['header'], sender = os.getenv('USERNAME'), recipients = [data['recipient']])
		msg.body = data['body']
		html = ""
		if len(data['data']) == 0:
			msg.body = "Apologies, there is no incomes and expenses to generate a balance on this date"
		else:
			html = convertHTML(data['data'])
		msg.html = html
		mail.send(msg)
		return 'Email sent.'
	except Exception as ex:
		print(ex, flush=True)
		return 'Error'

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8081)