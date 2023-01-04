import { Injector, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
export class BaseComponent {
    public _renderer: any;
    public _route: ActivatedRoute;
    public _api : ApiService;
    public ckeConfig: any;
    constructor(injector: Injector) {
        this._renderer = injector.get(Renderer2);
        this._route = injector.get(ActivatedRoute);
        this._api = injector.get(ApiService);
    }
    public loadScripts(...list: string[] ) {
        list.forEach(x=> {
            this.renderExternalScript(x).onload = () => {
            }
        })
    }
    public renderExternalScript(src: string): HTMLScriptElement {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.defer = true;
        this._renderer.appendChild(document.body, script);
        return script;
    }
    public formatDate(date:any) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [ day, month, year].join('-');
      }

   public ckeditorConfig() {
        this.ckeConfig = {
            height: 500,
            language: 'vi',
            allowedContent: true,
            toolbar: [
              { name: 'clipboard', items: ['Source', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
              { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll'] },
              { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
              { name: 'insert', items: ['Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
              { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
              { name: 'tools', items: [ 'ShowBlocks', 'Maximize'] },
              '/',
              { name: 'styles', items: [ 'Font', 'FontSize' ] },
              { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
              { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv'] },
              ],
          };
    }


}
