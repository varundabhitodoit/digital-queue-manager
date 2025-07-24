const QRCode = require('qrcode');

function generateQRCode(url) {
    return QRCode.toDataURL(url);
}

module.exports = generateQRCode;
