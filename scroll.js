function scrollToElementById(data) {
    console.log("scrollToElementById: " + data)
    try {
        document.getElementById(data).scrollIntoView({
            behavior: 'smooth',
            inline: 'center'
        })
    }
    catch (err) {
        console.log(err)
    }

}