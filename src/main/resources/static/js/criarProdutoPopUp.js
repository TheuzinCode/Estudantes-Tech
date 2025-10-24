let popup = document.getElementById("popup")

function openPopup() {
    if (popup) popup.classList.add("open-popup")
}

function closePopup() {
    if (popup) popup.classList.remove("open-popup")
    if (typeof nextImg !== 'undefined' && nextImg) nextImg.innerHTML = ""
}

const inputFile = document.getElementById('picture_input')
const pictureImage = document.querySelector('.picture_image')
const nextImg = document.querySelector('#textNextImage')
if (pictureImage) pictureImage.innerHTML = "Escolha a(s) imagem(ns) do produto"

if (inputFile) {
    inputFile.addEventListener('change', function(e) {
        const inputTarget = e.target
        const files = inputTarget.files

        if (files) {
            for(const file of files) {
                const reader = new FileReader()

                reader.addEventListener('load', function (e) {
                    const readerTarget = e.target

                    const img = document.createElement('img')
                    img.src = readerTarget.result
                    img.classList.add('picture_img')
                    img.style.maxWidth = "80px";
                    img.style.maxHeight = "80px";
                    if (nextImg) nextImg.appendChild(img)
                })

                reader.readAsDataURL(file)
            }
        } else if (pictureImage) {
            pictureImage.innerHTML = "Escolha a(s) imagem(ns) do produto"
        }
    })
}

const btnSaveImages = document.querySelector('.popup .btn-submit')
const previewImg = document.getElementById('preview-img')

if (btnSaveImages) {
    btnSaveImages.addEventListener('click', function(e) {
        const files = inputFile?.files

        if (files && files.length > 0) {
            const firstFile = files[0]
            const reader = new FileReader()

            reader.onload = function(event) {
                if (previewImg) {
                    previewImg.src = event.target.result
                    previewImg.style.display = 'block'
                }
            }

            reader.readAsDataURL(firstFile)
            closePopup()
        } else {
            alert('Selecione pelo menos uma imagem para salvar.')
        }
    })
}