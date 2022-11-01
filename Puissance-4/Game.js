class Game
{
    players = []
    currentPlayer = null;

    constructor(numberOfRows, numberOfColumns, piecesToAlign) {
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
        this.piecesToAlign = piecesToAlign;
        this.HTMLTable = this.generateTable()
        this.HTMLHeader = this.generateHeader()
        this.cells = this.generateCells()
    }

    addPlayers(player) {
        this.players.push(player)
        // Set le joueur actuel si il n'y en as pas le premier joueur instcrit sera donc le premier à jouer
        !this.currentPlayer ? this.setCurrentPlayer(player) : null;
    }

    removePlayer(player) {
        const playerIndex = this.players.indexOf(player)
        this.players.splice(playerIndex)
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player
        this.modifyTableHeader(this.currentPlayer.name)
    }

    swapPlayers() {
        this.currentPlayer = this.players[(this.players.indexOf(this.currentPlayer)??0) +1] ?? this.players[0]
        this.modifyTableHeader(this.currentPlayer.name)
    }

    generateTable() {
        // génération de la table
        let table = document.createElement('table');
        document.getElementById('puissance-4').appendChild(table);
        return table
    }

    generateHeader() {
        // Génération du header de la table
        let tableHeader = this.HTMLTable.createTHead().insertRow().insertCell()
        // colspan représente la largeur de la cellule en nombre de colones
        tableHeader.colSpan = this.numberOfColumns

        return tableHeader;
    }

    generateCells() {
        let cells = []
        let tableBody = this.HTMLTable.createTBody()
        for(let row = 0; row<this.numberOfRows; row++) {
            let tableRow = tableBody.insertRow();
            for(let column = 0; column<this.numberOfColumns; column++) {
                let cell = new Cell(row, column, tableRow.insertCell())
                cells.push(cell)

                cell.HTMLCell.addEventListener('click', () => {
                    let validCellsInColumn = this.cells.filter(obj => {
                        return obj.column === cell.column && obj.valid === true
                    })
                    if (validCellsInColumn.length === 0) {
                        return
                    }
                    let lowestCellInColumn = validCellsInColumn[validCellsInColumn.length-1]
                    lowestCellInColumn.change(this.currentPlayer)
                    // changement de joueur
                    this.swapPlayers()
                    this.checkWinHorizontal()
                })
            }
        }
        return cells
    }

    /**
     * Modifie le header du tableau
     * @param {string}message
     * @param {string}backgroundColor
     * @param {boolean}hasButton
     */
    modifyTableHeader(message, backgroundColor = 'lightgrey', hasButton = false) {
        this.HTMLHeader.innerHTML = message
        this.HTMLHeader.style.backgroundColor = backgroundColor
    }

    checkWinHorizontal() {
        for(let row = 0; row<this.numberOfRows; row++){
            let cellsInRow = this.cells.filter(cell => {
                return cell.row === row
            })
            let counter = 1
            let elem = null;
            cellsInRow.forEach((cell) => {
                // cell.player ? console.log(cell.player) : null
                if (cell.player instanceof Player) {
                    if (cell.player === elem) {
                        counter++
                    } else {
                        counter = 1;
                    }
                    if(counter === this.piecesToAlign) {
                        this.win(cell.player)
                    }
                }
                elem = cell.player
            })
        }
    }

    win(player) {
        this.modifyTableHeader(player.name+' won', 'green')
        this.cells.forEach((cell) => {
            cell.removeEventListeners()
        })
    }
}