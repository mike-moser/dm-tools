import { useState } from "react";
import { AdjustableImage } from "./interfaces";
import ModalImageViewer from "./modal-image-viewer.component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';


const ImageSlider = ({ images } : { images: AdjustableImage[] }) => { // takes in images as props
    const [current, setCurrent] = useState(0); // create state to keep track of images index, set the default index to 0

    const slideRight = () => {
        setCurrent((current + 1) % images.length); // increases index by 1
    };

    const slideLeft = () => {
        const nextIndex = current - 1;
        if (nextIndex < 0) {
        setCurrent(images.length - 1); // returns last index of images array if index is less than 0
        } else {
        setCurrent(nextIndex);
        }
    };

    return (
        <div className="img-box">
            {(images.length > 1) && 
                <div className="img-box-arrows left" onClick={slideLeft}><FontAwesomeIcon icon={ faCaretLeft } size="xs" /></div> }
            {(images.length > 0) && <ModalImageViewer source={images[current].source} width={images[current].width} height={images[current].height} caption={images[current].caption} />}
            {(images.length > 1) &&
            <div className="img-box-arrows right" onClick={slideRight}><FontAwesomeIcon icon={ faCaretRight } size="xs" /></div> }
        </div>
    )
}

export default ImageSlider;

