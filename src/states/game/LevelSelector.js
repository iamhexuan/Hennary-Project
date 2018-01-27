export default {
    return {
        loadLevelSelector({ levels = [] } = {}){
            const levels_sorted = levels.sort((lvl_a, lvl_b) => lvl_a.levelNumber - lvl_b.levelNumber )
            
            levels_sorted.forEach(lvl => {
                const lvl_img_id = `level_${lvl.levelNumber}`
                const lvl_img_name = (!!lvl_a.thumbnail && !!lvl_a.thumbnail.path) ? 
                    lvl_a.thumbnail.path : 
                    `level_${lvl.levelNumber}_thumbnail.png`
                const game.load.image(lvl_img_id, lvl_img_name)
            })
        }
       
        drawLevelSelector({ mainCanvas = {}, levels = [], currentLevelNumber = 0 } = {}){
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
            
            const currentLevel = levels_obj[currentLevelNumber]
            
            const th_width = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.width : 500
            const th_height = (!!currentLevel && !!currentLevel.thumbnail) ? currentLevel.thumbnail.height : 400
            
            const levels_sorted = levels.sort((lvl_a, lvl_b) => lvl_a.levelNumber - lvl_b.levelNumber )
            
            const current_level_id = `level_${currentLevelNumber}`
            
            const current_sprite = game.add.sprite(mid_width - th_width / 2, mid_height - th_height / 2, current_level_id)            
        }
        
        
    }
}