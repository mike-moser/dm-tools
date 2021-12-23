const DisplayImage = ({ source, width, height, caption } : { source: string, width: number, height: number, caption: string }) => {
    var maxHeight = 600;
    var maxWidth = 800;
    var newHeight = height;
    var newWidth = width;

    if(width > height && width > maxWidth)
    {
        if(width > maxWidth)
        {
            newHeight = Math.floor(height * (maxWidth / width));
            newWidth = maxWidth;
        }
    }        
    else if(height > width && height > maxHeight)
    {
        if(height > maxHeight)
        {
            newWidth = Math.ceil(width * (maxHeight / height));
            newHeight = Math.ceil(maxHeight);
        }
    }

    return(
        <span>
            <img className="img-box" src={ process.env.PUBLIC_URL.concat("/images/", source) } width={ newWidth } height={ newHeight } alt={ caption } />
        </span>
    )
}

export default DisplayImage;