import config from './../../config.js';
import Dialog_class from './../../libs/popup.js';

class Help_about_class {

	constructor() {
		this.POP = new Dialog_class();
	}

	//about
	about() {
		var email = 'logen9956@gmail.com';	
		
		var settings = {
			title: 'About',
			params: [
				{title: "Name:", html: '<span class="about-name">Peditor</span>'},
				{title: "Version:", value: VERSION},
				{title: "Description:", value: "Online image editor."},
				{title: "Author:", value: 'Kulak V.O.'},
				{title: "Email:", html: '<a href="mailto:' + email + '">' + email + '</a>'},
				{title: "Website:", html: '<a href="https://localhost/peditor/">https://localhost/peditor/</a>'},
			],
		};
		this.POP.show(settings);
	}

}

export default Help_about_class;
