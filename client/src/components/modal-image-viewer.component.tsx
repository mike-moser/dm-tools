import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons';

const modalRoot = document.getElementById("root");

const Modal = (props: any) => {
  return modalRoot ? ReactDOM.createPortal(
    <div className="image-modal">{props.children}</div>,
    modalRoot
  ) : null;
};

const ModalImageViewer: React.FunctionComponent<{ source: string, width: number, height: number, caption: string}> = (props) => {
    const { source, width, height, caption } = props;
    const [open, setOpen] = useState<boolean>(false);
    let newWidth = width / 1.75;
    let newHeight = height / 1.75;

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <div className="image-preview-box" onClick={handleOpen}>
                <img className="image-preview" src={ process.env.PUBLIC_URL.concat("/images/", source) } width={ newWidth } height={ newHeight } alt={(caption === undefined || caption === null) ? source : caption } />
            </div>
            {open &&
                <Modal in={open}>
                    <span className="image-modal-close-button" onClick={handleClose}><FontAwesomeIcon icon={faTimes} /></span>
                    <img className="image-modal-content" src={ process.env.PUBLIC_URL.concat("/images/", source) } height={ '93%' } alt={(caption === undefined || caption === null) ? source : caption } />
                    {caption !== undefined && caption !== null &&
                        <div className="image-modal-caption">{ caption }</div>
                    }
                </Modal>
            }
      </div>
    );

}

export default ModalImageViewer;