import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const saveAsPng = (id, title) => {
    window.scrollTo(0, 0);
    html2canvas(document.querySelector(`#${id}`), {
        allowTaint: true,
        useCORS: true,
    }).then(canvas => {
        canvas.toBlob(function (blob) {
            saveAs(blob, `${title}.png`);
        });
    });
};
