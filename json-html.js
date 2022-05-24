class JsonToHtml {

    constructor() {}

    generateHtml(json) {
        const defaultStyles = `body{font-family:'Tahoma'}img{height: 100px;}.field{display:inline-flex;flex-direction:column;margin-bottom:16px;margin-right:32px;width:calc(33% - 22px)}.field:nth-child(3n+3){margin-right:0}lable{font-size:.875rem;color:#333}lable::after{content:':'}value{font-size:1rem;font-weight:500}table{width:auto;max-width: 100%;margin:24px 0;color:#212529;border:1px solid #dee2e6;border-collapse:collapse}table th,table td{padding:6px 10px;border:1px solid #dee2e6;border-top:1px solid #dee2e6;text-align:left}table thead th{padding:8px 10px;vertical-align:bottom;border:1px solid #dee2e6;border-bottom:2px solid #dee2e6;background:#fafbfc;}table td table{margin:0}`;
        let defaultHtml = '<html><head><style>' + defaultStyles + '</style></head><body>';
        defaultHtml += this.html(json, true);
        defaultHtml += '</body></html>';
        return encodeURIComponent(defaultHtml);
    }

    html(object, init = false, hideEmpty = false) {
        this.htmlString = init ? '' : this.htmlString;
        if (object === null) {
            return;
        }
        if (Array.isArray(object)) {
            this.htmlString += this.renderTable(null, object);
        } else {
            for (const field of Object.keys(object)) {
                if (typeof object[field] === 'object' && object[field] !== null) {
                    if (Array.isArray(object[field])) {
                        this.htmlString += this.renderTable(field, object[field]);
                    } else {
                        this.html(object[field]);
                    }
                } else {
                    this.htmlString += this.renderField(field, object[field]);
                }
            }
        }
        return this.htmlString;
    }

    isUrlValid(url) {
        const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res === null ? false : true;
    }

    isEmailValid(email) {
        const res = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        return res === null ? false : true;
    }

    isImageValid(image) {
        const res = String(image)
            .match(
                /\.(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg|svg|SVG)$/
            );
        return res === null ? false : true;
    }

    renderLinkMailImage(value) {
        let html = value;
        if (value && value !== '' && typeof value === 'string') {
            if (this.isImageValid(value)) {
                html = `<a href="${value}" target="_blank"><img src="${value}"></a>`;
            } else if (value.indexOf('http') !== -1 || value.indexOf('https') !== -1) {
                if (this.isUrlValid(value)) {
                    html = `<a href="${value}" target="_blank">${value}</a>`;
                }
            } else if (this.isEmailValid(value)) {
                html = `<a href="mailto:${value}">${value}</a>`;
            }
        }
        return html;
    }

    renderField(key, value) {
        if (this.hideEmpty && (!value || value === '')) {
            return '';
        } else {
            return `<div class="field">
                    <lable>${key}</lable>
                    <value>${this.renderLinkMailImage(value)}</value>
                </div>`;
        }
    }

    renderTable(key, data) {
        let tableString = '';
        if (data.length > 0) {
            tableString = '<table><thead><tr>';
            for (const field of Object.keys(data[0])) {
                tableString += '<th>' + field + '</th>';
            }
            tableString += '</tr></thead><tbody>';

            data.forEach((arrayItem) => {
                tableString += '<tr>';
                for (const itemKey in arrayItem) {
                    if (typeof arrayItem[itemKey] === 'object' && arrayItem[itemKey] !== null) {
                        if (Array.isArray(arrayItem[itemKey])) {
                            tableString += '<td>' + this.renderTable(itemKey, arrayItem[itemKey]) + '</td>';
                        } else {
                            tableString += '<td>' + this.html(arrayItem[itemKey]) + '</td>';
                        }
                    } else {
                        tableString += '<td>' + this.renderLinkMailImage(arrayItem[itemKey]) + '</td>';
                    }
                }
                tableString += '</tr>';
            });
            tableString += '</tbody></table>';
        }

        return tableString;
    }
}

module.exports = JsonToHtml;