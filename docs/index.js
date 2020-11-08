const canvas = document.querySelector('.canvas')
const trash = document.querySelector('.trash')
const trashMenu = document.querySelector('.trash-menu')
const trashX = document.querySelector('.trash-x')
const characterContainer = document.querySelector('.character-container')

class Character {
    constructor({ x, y, color }) {
        this.element = document.createElement('img')
        this.color = color
        this.isTrash = false
        this.initialX = x
        this.initialY = y

        document.body.appendChild(this.element)
        this.element.classList.add('character')
        this.element.classList.add(this.color)
        this.element.style.transition = 'width 0.1s ease-in-out'
        this.element.src = `../docs/images/${this.color}-character.svg`

        this.element.style.left = x + 'px'
        this.element.style.top = y + 'px'

        this.element.addEventListener('mousedown', e => {
            if (e.which === 3) return

            this.handleUpdatePosition({ e, element: this.element })
            this.element.style.transition = '0.3s ease'

            this.element.style.cursor = 'grabbing'
            this.element.style.width = '110px'

            window.onmousemove = e => {
                this.handleUpdatePosition({ e, element: this.element })
                this.element.style.transition = 'none'
            }

            window.onmouseup = e => {
                window.onmousemove = () => {}
                this.element.style.cursor = 'grab'
                this.element.style.width = '100px'

                this.handleTrash(e)

                window.onmouseup = () => {}
            }
        })
    }

    handleUpdatePosition({ e, element }) {
        const { clientX, clientY } = e

        if (clientX < 0) return
        if (clientX > window.innerWidth) return
        if (clientY < 0) return
        if (clientY > window.innerHeight) return

        element.style.left = clientX - element.offsetWidth / 2 + 'px'
        element.style.top = clientY - 15 + 'px'
    }

    handleTrash(e) {
        if (checkTrashCollision(e)) this.delete()
    }

    delete() {
        this.element.style.display = 'none'
        this.isTrash = true

        trash.style.width = '150px'
        trash.style.transform = 'translateX(-15px)'

        setTimeout(() => {
            trash.style.width = '120px'
            trash.style.transform = 'translateX(0)'
        }, 200)
    }

    restore() {
        this.element.style.display = 'block'
        this.isTrash = false
    }
}

// the array of colors
let colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'black',
    'white',
    'purple',
    'cyan',
    'brown',
    'lime',
]

// creating a character object for each color
colors = colors.map((color, i) => {
    console.log(i)

    const x = i * 100 + 300
    const y = window.innerHeight - 200

    return new Character({ x, y, color })
})

// collision detection
function checkTrashCollision(e) {
    const { clientX, clientY } = e

    const rect = trash.getBoundingClientRect()

    const x = rect.left
    const y = rect.top
    const x2 = rect.left + trash.offsetWidth
    const y2 = rect.top + trash.offsetHeight

    return clientX > x && clientX < x2 && clientY > y && clientY < y2
}

function checkTrashMenuCollision(e) {
    const { clientX, clientY } = e

    const rect = trashMenu.getBoundingClientRect()

    const x = rect.left
    const y = rect.top
    const x2 = rect.left + trashMenu.offsetWidth
    const y2 = rect.top + trashMenu.offsetHeight

    return clientX > x && clientX < x2 && clientY > y && clientY < y2
}

function updateTrashMenu() {
    characterContainer.innerHTML = ''

    colors
        .filter(color => color.isTrash)
        .forEach(color => {
            const element = document.createElement('img')
            characterContainer.appendChild(element)
            element.src = `../docs/images/${color.color}-character.svg`
            element.classList.add('trash-character')

            element.addEventListener('click', () => {
                color.restore()
                color.element.style.top = color.initialY + 'px'
                color.element.style.left = color.initialX + 'px'
                element.remove()
            })
        })
}

trash.addEventListener('click', () => {
    updateTrashMenu()
    trashMenu.style.display = 'block'
})

window.addEventListener('click', e => {
    if (!checkTrashMenuCollision(e) && !checkTrashCollision(e))
        trashMenu.style.display = 'none'
})

trashX.addEventListener('click', () => (trashMenu.style.display = 'none'))
