import LevelConfig from './levelConfig'
var level_config = new LevelConfig()

export default class LevelSelector {
    constructor({
        currentLevelNumber = 0,
        loadedLevels = [],
        onLevelSelect = val => val,
    } = {}){
        this.currentLevelNumber = currentLevelNumber
        this.loadedLevels = loadedLevels
        this.levelThumbnails = {}
        this.LevelNumbersOnStage = []
        this.stageSpriteGroup
        this.previousLevelNumberOutOfStage =  NaN
        this.nextLevelNumberOutOfStage =  NaN
        this.onLevelSelect = onLevelSelect
    }
    
    //load image resources
    loadLevelSelector({ levels = [], levelNumbers = [] } = {}){
        
        if (!this.stageSpriteGroup) this.stageSpriteGroup = game.add.group()
        
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
        unloadAllLevelsOnStage = false,
    } = {}){
        const width = (!!mainCanvas.width) ? mainCanvas.width : 1024
        const height = (!!mainCanvas.height) ? mainCanvas.height : 768
        
        console.log('drawLevelSelector init: ', arguments)
        
        if (unloadAllLevelsOnStage){
            this.unloadAllLevelsOnStage()
        }
        
        if (Number.isNaN(Number(currentLevelNumber)) || currentLevelNumber < 0){
            currentLevelNumber = this.currentLevelNumber
        }else{
            this.currentLevelNumber = currentLevelNumber
        }
        
        
        const mid_width = width / 2
        const mid_height = height / 2
        
        const levels_obj = (Array.isArray(levels)) ? levels.reduce((acc, lvl) => {
            if (typeof lvl.levelNumber !== 'undefined'){
                acc[lvl.levelNumber] = lvl
            }
            return acc
        }, {}) : {}
        
        const all_level_numbers = levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined').sort((a,b) => a-b)
        
       // const level_numbers = (!ignoreLoadedLevelsInClass && Array.isArray(this.loadedLevels) && this.loadedLevels.length > 0) ? 
         //   this.loadedLevels.sort((a,b) => a-b) : all_level_numbers
         const  level_numbers = all_level_numbers  
        
        const currentLevel = levels_obj[currentLevelNumber]
        
        const th_width = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.width : 500
        const th_height = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.height : 400
        
        const levels_sorted = levels.sort((lvl_a, lvl_b) => lvl_a.levelNumber - lvl_b.levelNumber )
        
        let genLevelKey = this.getSpriteKeyOnLevelNumber
        
        let check_level = num => this.isLevelExist({levelNumber: num})
        
        const current_level_idx = all_level_numbers.indexOf(currentLevelNumber)
        
        const current_level_idx_at_all_levels = level_numbers.indexOf(currentLevelNumber)
        
        let pre_level_number, next_level_number
        
        if (current_level_idx > 0 && check_level(level_numbers[current_level_idx - 1])) 
            pre_level_number = level_numbers[current_level_idx - 1]
        if (current_level_idx >= 0 && check_level(level_numbers[current_level_idx + 1])) 
           next_level_number = level_numbers[current_level_idx + 1]
                
        console.log('Level numbers: ', pre_level_number, next_level_number)
        
        const offset_x = 40
        const offset_v = 30
        
        let pre_sprite, next_sprite
        
        // previous level
        if (typeof pre_level_number !== 'undefined'){
            pre_sprite = game.add.sprite(
                mid_width - th_width / 2 - thumbnailSize.width + offset_x, 
                mid_height - th_height / 2 + offset_v, 
                genLevelKey(pre_level_number)
            )
            
            this.stageSpriteGroup.add(pre_sprite)
            
            this.LevelNumbersOnStage.push(pre_level_number)
            
            pre_sprite.data = level_config.getConfig(pre_level_number)
            
            this.previousLevelNumberOutOfStage = check_level(all_level_numbers[current_level_idx_at_all_levels - 2]) ? 
                all_level_numbers[current_level_idx_at_all_levels - 2] : NaN    
            
        }else{
            this.previousLevelNumberOutOfStage = NaN
        }
        
        // next level
        if (typeof next_level_number !== 'undefined'){
            next_sprite = game.add.sprite(
                mid_width - th_width / 2 + thumbnailSize.width - offset_x, 
                mid_height - th_height / 2 + offset_v, 
                genLevelKey(next_level_number)
            )
            
            this.stageSpriteGroup.add(next_sprite)
            
            this.LevelNumbersOnStage.push(next_level_number)
            
            next_sprite.data = level_config.getConfig(next_level_number)
            
            this.nextLevelNumberOutOfStage = check_level(all_level_numbers[current_level_idx_at_all_levels + 2]) ? 
                all_level_numbers[current_level_idx_at_all_levels + 2] : NaN
        }else{
            this.nextLevelNumberOutOfStage = NaN
        }
        
        const current_sprite_props = [mid_width - th_width / 2, mid_height - th_height / 2, genLevelKey(currentLevelNumber)]
        
        const current_sprite_shadow = game.add.sprite(...current_sprite_props)
        const current_sprite = game.add.sprite(...current_sprite_props)
        
        this.stageSpriteGroup.add(current_sprite_shadow)
        this.stageSpriteGroup.add(current_sprite)
        
        
        current_sprite.data = level_config.getConfig(currentLevelNumber)
        
        current_sprite_shadow.anchor.set(-0.02)
        current_sprite_shadow.tint = 0x000000
        current_sprite_shadow.alpha = 0.6
        
        this.LevelNumbersOnStage.push(currentLevelNumber)
        
        this.LevelNumbersOnStage.sort((a,b) => (a < b) ? -1 : (a === b) ? 0 : 1)
        
        current_sprite.inputEnabled = true
        
        current_sprite.events.onInputDown.add(this.handleCurrentLevelClick, this);
        
        [pre_sprite, next_sprite].forEach(sprite => {
            if (!!sprite){
                sprite.inputEnabled = true
                sprite.events.onInputDown.add(ev => this.handleOtherLevelClick(ev, arguments[0]), this)
            }
        })
        
        console.log('draw level: ',this)
    }
    
    handleCurrentLevelClick(ev){
        console.log('clicked current level', this, ev)
        this.onLevelSelect(ev.data)
        // const event = new CustomEvent('level-select', ev)
    }
    
    handleOtherLevelClick(ev, args){
        
        // this.onLevelSelect(ev.data)
        // const event = new CustomEvent('level-select', ev)
        let lvl_num = (!!ev.key) ? ev.key.split('_').pop() : NaN
        console.log(lvl_num)
        if (!Number.isNaN(lvl_num) && !!lvl_num || lvl_num === 0){
            lvl_num = Number(lvl_num)
        }else{
            return
        }
        
        if (Number.isNaN(lvl_num)) return
        
        console.log('clicked other level', lvl_num, this, ev)
        
        this.drawLevelSelector({ 
            mainCanvas : args.mainCanvas, 
            levels : args.levels, 
            currentLevelNumber : lvl_num,
            thumbnailSize : args.thumbnailSize,
            ignoreLoadedLevelsInClass: false,
            unloadAllLevelsOnStage : true,
        })
    }
    
    // NOT IMPLEMENTED
    moveLevelsSelector({
        toLevelNumber = -1, 
        levels = [], 
        levelNumbersOnStage = [],
        currentLevelNumber = -1,
    } = {}){
        const all_level_numbers = levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined').sort((a,b) => a-b)
        
        let lvl_nums_on_stage = (Array.isArray(levelNumbersOnStage) && levelNumbersOnStage.length > 0) ? 
            levelNumbersOnStage : this.levelNumbersOnStage
            
            lvl_nums_on_stage.sort((a,b) => a - b)
        
        if (currentLevelNumber < -1) currentLevelNumber = this.currentLevelNumber
        
        this.drawLevelSelector({
            
        })
        
               
    }
    
    unloadAllLevelsOnStage(){
        this.currentLevelNumber = NaN
        this.LevelNumbersOnStage = []
        if (!!this.stageSpriteGroup){
            this.stageSpriteGroup.callAll('kill')
        }
        
        this.previousLevelNumberOutOfStage =  NaN
        this.nextLevelNumberOutOfStage =  NaN
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