import LevelConfig from './levelConfig'
var level_config = new LevelConfig()

export default class LevelSelector {
    constructor({
        currentLevel = 0,
        loadedLevels = [],
    } = {}){
        this.currentLevel = currentLevel
        this.loadedLevels = loadedLevels
        this.levelThumbnails = {}
        this.LevelNumbersOnStage = []
    }
    
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
       
        const lvl_img_id = `level_${lvl_num}`
        
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
        currentLevelNumber = 0,
        thumbnailSize = { width: 500, height: 300 }
    } = {}){
        const width = (!!mainCanvas.width) ? mainCanvas.width : 1024
        const height = (!!mainCanvas.height) ? mainCanvas.height : 768
        
        const mid_width = width / 2
        const mid_height = height / 2
        
        const levels_obj = levels.reduce((acc, lvl) => {
            if (typeof lvl.levelNumber !== 'undefined'){
                acc[lvl.levelNumber] = lvl
            }
            return acc
        }, {})
        
        const level_numbers = levels.map(lvl => lvl.levelNumber).filter(num => typeof num !== 'undefined').sort((a,b) => a-b)
        
        const currentLevel = levels_obj[currentLevelNumber]
        
        const th_width = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.width : 500
        const th_height = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.height : 400
        
        const levels_sorted = levels.sort((lvl_a, lvl_b) => lvl_a.levelNumber - lvl_b.levelNumber )
        
        let genLevelKey = num => `level_${num}` 
        
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
        
        game.add.sprite(mid_width - th_width / 2, mid_height - th_height / 2, genLevelKey(currentLevelNumber))
        this.LevelNumbersOnStage.push(currentLevelNumber)
        
        this.LevelNumbersOnStage.sort((a,b) => (a < b) ? -1 : (a === b) ? 0 : 1)
    }
    
    isLevelExist({levelNumber = -1} = {}){
        if (typeof levelNumber === undefined) return false
        const level = level_config.getConfig(levelNumber)
        return !!level
    }
}