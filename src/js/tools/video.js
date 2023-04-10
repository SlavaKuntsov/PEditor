import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Base_layers_class from './../core/base-layers.js';
import Dialog_class from './../libs/popup.js';
import GUI_tools_class from './../core/gui/gui-tools.js';
import '../libs/dat.gui.min.js';
import '../libs/utils.js';
import '../libs/webgl-utils.js';
import '../../../build/clmtrackr.js';
import '../../../models/model_pca_20_svm.js';
import '../libs/Stats.js';
import '../libs/face_deformer.js';
import '../libs/jquery.min.js';
import '../libs/poisson_new.js';
class Video_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.GUI_tools = new GUI_tools_class();
		this.POP = new Dialog_class();
		this.ctx = ctx;
		this.name = 'video';
		this.layer = {};
		this.preview_width = 150;
		this.preview_height = 120;
	}

	load() {

	}

	on_activate() {
		this.show_video();
	}

	async show_video(){
		var _this = this;
		var html = "";
        var response = await fetch('/Peditor/html.txt');
        html = await response.text();
		var setInnerHtml= this.setInnerHtml;
		var settings = {
			title: 'Video',
			className: 'wide',
			on_load: function (params, popup) {
				var node = document.createElement("div");
				setInnerHtml(node,html);
				popup.el.querySelector('.dialog_content').appendChild(node);
			},
		};
		this.POP.show(settings);

		//sleep, lets wait till DOM is finished
		await new Promise(r => setTimeout(r, 10));
	}

	render(ctx, layer) {

	}
	
	setInnerHtml(elm, html) {
		elm.innerHTML = html;
		Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
		  const newScript = document.createElement("script");
		  Array.from(oldScript.attributes)
			.forEach(attr => newScript.setAttribute(attr.name, attr.value));
		  newScript.appendChild(document.createTextNode(oldScript.innerHTML));
		  oldScript.parentNode.replaceChild(newScript, oldScript);
		});
	  }

}

export default Video_class;
