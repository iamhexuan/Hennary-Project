import LevelConfig from './levelConfig'
var level_config = new LevelConfig()

export default class LevelSelector {
    constructor({
        currentLevelNumber = 0,
        loadedLevels = [],
    } = {}){
        this.currentLevelNumber = currentLevelNumber
        this.loadedLevels = loadedLevels
        this.levelThumbnails = {}
        this.LevelNumbersOnStage = []
        this.previousLevelNumberOutOfStage =  NaN
        this.nextLevelNumberOutOfStage =  NaN
    }
    
    //load image resources
    loadLevelSelector({ levels = [], levelNumbers = [] } = {}){
        const lvl_nums = Array.isArray(levelNumbers) && levelNumbers.length > 0 ?
            levelNumbers : levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined')
             
        const levels_obj = levels.reduce((lvl, acc) => {
            const num = lvl.levelNumber
            if (typeof num !== 'undefined') acc[num] = lvl 
            return acc
        },{})
        
        lvl_nums.forEach(lvl_num => {
            
            const { key, name, path } = (
                !!this.levelThumbnails && ['key', 'name', 'path'].filter(key => key in this.levelThumbnails).length === 3
            ) ? this.levelThumbnails : 
                this.generateDefaultThumbnailProperties({ level: levels_obj[lvl_num],levelNumber: lvl_num })
            
            game.load.image(key, path)
            
            console.log('loaded image: ', lvl_num, key, path)
            
            if (!this.loadedLevels.includes(lvl_num)) this.loadedLevels.push(lvl_num)
            
            const thumbnail = {
                'key': key,
                'name': name,
                'path': path,
            }
            Object.assign(this.levelThumbnails,  {[lvl_num] : thumbnail } )
        })
    }
    
    generateDefaultThumbnailProperties({ level, levelNumber } = {}){
       
        const [lvl, lvl_num] = [level, levelNumber]
       
        const lvl_img_id = this.getSpriteKeyOnLevelNumber(lvl_num)
        
        console.log('load level: ', lvl, lvl_img_id)
        
        const lvl_img_name = (!!lvl && lvl.thumbnail && !!lvl.thumbnail.path) ? 
            lvl.thumbnail.path : 
            `level_${lvl_num}_thumbnail.png`
            
        const lvl_img_path = lvl_img_name.includes('/') ? lvl_img_name : `assets/images/levels/${lvl_img_name}`
        return {
            key: lvl_img_id,
            name: lvl_img_name.split('/').pop(),
            path: lvl_img_path
        }
    }
    
    drawLevelSelector({ 
        mainCanvas = {}, 
        levels = [], 
        currentLevelNumber = -1,
        thumbnailSize = { width: 500, height: 300 },
        ignoreLoadedLevelsInClass = false,
    } = {}){
        const width = (!!mainCanvas.width) ? mainCanvas.width : 1024
        const height = (!!mainCanvas.height) ? mainCanvas.height : 768
        
        if (currentLevelNumber < 0) currentLevelNumber = this.currentLevel
        
        const mid_width = width / 2
        const mid_height = height / 2
        
        const levels_obj = levels.reduce((acc, lvl) => {
            if (typeof lvl.levelNumber !== 'undefined'){
                acc[lvl.levelNumber] = lvl
            }
            return acc
        }, {})
        
        const all_level_numbers = levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined').sort((a,b) => a-b)
        
        const level_numbers = (!ignoreLoadedLevelsInClass && Array.isArray(this.loadedLevels) && this.loadedLevels.length > 0) ? 
            this.loadedLevels.sort((a,b) => a-b) : all_level_numbers
            
        
        const currentLevel = levels_obj[currentLevelNumber]
        
        const th_width = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.width : 500
        const th_height = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.height : 400
        
        const levels_sorted = levels.sort((lvl_a, lvl_b) => lvl_a.levelNumber - lvl_b.levelNumber )
        
        let genLevelKey = this.getSpriteKeyOnLevelNumber
        
        let check_level = num => this.isLevelExist({levelNumber: num})
        
        const current_level_idx = level_numbers.indexOf(currentLevelNumber)
        
        let pre_level_number, next_level_number
        
        if (current_level_idx > 0 && check_level(level_numbers[current_level_idx - 1])) 
            pre_level_number = level_numbers[current_level_idx - 1]
        if (current_level_idx >= 0 && check_level(level_numbers[current_level_idx + 1])) 
           next_level_number = level_numbers[current_level_idx + 1]
        
        
        
        console.log('Level numbers: ', pre_level_number, next_level_number)
        
        const offset_x = 40
        const offset_v = 30
        
        if (typeof pre_level_number !== 'undefined'){
            game.add.sprite(
                mid_width - th_width / 2 - thumbnailSize.width + offset_x, 
                mid_height - th_height / 2 + offset_v, 
                genLevelKey(pre_level_number)
            )
            this.LevelNumbersOnStage.push(pre_level_number)
        }
        
        if (typeof next_level_number !== 'undefined'){
            game.add.sprite(
                mid_width - th_width / 2 + thumbnailSize.width - offset_x, 
                mid_height - th_height / 2 + offset_v, 
                genLevelKey(next_level_number)
            )
            this.LevelNumbersOnStage.push(next_level_number)
        }
        
        const current_sprite_props = [mid_width - th_width / 2, mid_height - th_height / 2, genLevelKey(currentLevelNumber)]
        
        const shadow = game.add.sprite(...current_sprite_props)
        const current_sprite = game.add.sprite(...current_sprite_props)
        
        current_sprite.data = level_config.getConfig(currentLevelNumber)
        
        shadow.anchor.set(-0.02)
        shadow.tint = 0x000000
        shadow.alpha = 0.6
        
        this.LevelNumbersOnStage.push(currentLevelNumber)
        
        this.LevelNumbersOnStage.sort((a,b) => (a < b) ? -1 : (a === b) ? 0 : 1)
        
        current_sprite.inputEnabled = true
        
        current_sprite.events.onInputDown.add(this.handleCurrentLevelClick, this)
        
    }
    
    handleCurrentLevelClick(ev){
        console.log('clicked', this, ev)
    }
    
    moveLevelsSelector({
        direction = 'right', 
        levels = [], 
        levelNumbersOnStage = [],
        currentLevelNumber = -1,
    } = {}){
        const all_level_numbers = levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined').sort((a,b) => a-b)
        
        let lvl_nums_on_stage = (Array.isArray(levelNumbersOnStage) && levelNumbersOnStage.length > 0) ? 
            levelNumbersOnStage : this.levelNumbersOnStage
            
            lvl_nums_on_stage.sort((a,b) => a - b)
        
        if (currentLevelNumber < -1) currentLevelNumber = this.currentLevelNumber
        
        const lvl_nums_incr = "direction === 'right'" ? 1 : -1        
    }
    
    getSpriteKeyOnLevelNumber(num){
        return `level_${num}` 
    }
    
    isLevelExist({levelNumber = -1} = {}){
        if (typeof levelNumber === undefined) return false
        const level = level_config.getConfig(levelNumber)
        return !!level
    }
}