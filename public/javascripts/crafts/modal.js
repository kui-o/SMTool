let craftsPreference;

function loadCraftsPreference() {
    const obj = JSON.parse(sessionStorage.getItem('preference.crafts') || localStorage.getItem('preference.crafts') || '{"bookmarks":[],"settings":[]}');
    obj.bookmarks ??= [];
    obj.settings ??= Array(3).fill().map(() => ({
        preset: 1,
        enabledList: Array(3).fill(false),
        valueList: Array(27).fill(0)
    }));
    return obj;
}

function saveCraftsPreference(param) {
    const json = JSON.stringify(param);
    if (sessionStorage.getItem('preference.crafts')) {
        sessionStorage.setItem('preference.crafts', json);
        $.ajax({
            url: url + '/crafts/preference',
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: {
                j: json
            },
            error: function (xhr, status, error) {
                if(xhr.status === 429) return;
                showError(true);
                if (xhr.status === 401) {
                    logout();
                }
            }
        });
    } else {
        localStorage.setItem('preference.crafts', json);
    }
}

let craftsModifier = {
    cost: Array(8).fill(0),
    bonus: Array(8).fill(0),
    energy: Array(8).fill(0),
}

function applyModifier(){
    const enabledList = $('#setting-modal input[type="checkbox"]').map((i, ele) => $(ele).prop('checked'));
    const valueList = $('#setting-modal input[type="number"]').map((i, ele) => parseInt($(ele).val()));
    if(!enabledList[0]) {
        craftsModifier.cost = Array(8).fill(0);
    } else {
        const defaultValue = valueList[0] || 0;
        for(let i=0; i<8; i++){
            craftsModifier.cost[i] = defaultValue + (valueList[i+1] || 0);
        }
    }

    if(!enabledList[1]) {
        craftsModifier.bonus = Array(8).fill(0);
    } else {
        const defaultValue = valueList[9] || 0;
        for(let i=0; i<8; i++){
            const percentage = defaultValue + (valueList[i+10] || 0);
            craftsModifier.bonus[i] = 5 * (1 + (percentage / 100));
        }
    }

    if(!enabledList[2]) {
        craftsModifier.energy = Array(8).fill(0);
    } else {
        const defaultValue = valueList[18] || 0;
        for(let i=0; i<8; i++){
            craftsModifier.energy[i] = defaultValue + (valueList[i+19] || 0)
        }
    }
    if(typeof applyModifierToRecipe === 'function') applyModifierToRecipe();
    if(typeof calculate === 'function') calculate();
}

function renderModal(num = 1) {
    if (!craftsPreference.settings[num - 1]) {
        $('#setting-modal input[type="checkbox"]').prop('checked', false);
        $('#setting-modal input[type="number"]').attr('data-num', '0').val('0').prop('disabled', true);
        return;
    }
    const pref = craftsPreference.settings[num - 1];
    $('#setting-modal input[type="checkbox"]').each((i, item) => {
        $(item).prop('checked', pref.enabledList[i]);
    });
    let checked;
    $('#setting-modal input[type="number"]').each((i, item) => {
        if (i % 9 === 0) {
            checked = pref.enabledList[Math.floor(i / 9)];
        }
        const input = $(item);
        const value = pref.valueList[i];
        input.attr('data-num', value);
        if (checked) {
            input.val(value).prop('disabled', false);
        } else {
            input.val('0').prop('disabled', true);
        }
    });

}

function extractModal(num = 1) {
    const data = {preset: num, enabledList: [], valueList: []};
    $('#setting-modal input[type="checkbox"]').each((i, item) => {
        data.enabledList[i] = $(item).prop('checked');
    });
    $('#setting-modal input[type="number"]').each((i, item) => {
        data.valueList[i] = parseInt($(item).attr('data-num')) || 0;
    });
    craftsPreference.settings[num - 1] = data;
}

function initCrafts() {
    craftsPreference = loadCraftsPreference();
    renderModal();
    applyModifier();
}

initArrays.push(initCrafts);
initCrafts();


$('#setting-modal #reset-btn').on('click', (event) => {
    const opt = confirm('모든 값을 초기화하시겠습니까?\n초기화 후 저장 버튼을 눌러 주세요.');
    if (!opt) return;
    craftsPreference.settings = Array(3).fill().map(() => ({
        preset: 1,
        enabledList: Array(3).fill(false),
        valueList: Array(27).fill(0)
    }));
    $('.presets-panel button').removeClass('active');
    $('.presets-panel button:first').addClass('active');
    renderModal();
});

$('#setting-modal #save-btn').on('click', (event) => {
    $('#setting-modal').modal('hide');
    const num = parseInt($('.presets-panel>button.active').text());
    applyModifier();
    extractModal(num);
    saveCraftsPreference(craftsPreference);
});

$('#setting-modal .presets-panel').on('click', 'button', (event) => {
    const btn = $(event.currentTarget);
    if (btn.hasClass('active')) return;
    const nextNum = parseInt(btn.text());
    const prevNum = parseInt($('.presets-panel>button.active').text());
    $('.presets-panel>button').removeClass('active');
    btn.addClass('active');
    extractModal(prevNum);
    renderModal(nextNum);
});

$('#setting-modal').on('change', 'input[type="checkbox"]', (event) => {
    const checkbox = $(event.currentTarget);
    const section = checkbox.closest('.setting-section');
    const inputs = section.find('input[type="number"]');
    if (checkbox.is(':checked')) {
        inputs.each((i, item) => {
            const input = $(item);
            const value = $(item).attr('data-num') || 0;
            input.val(value).prop('disabled', false);
        });
    } else {
        inputs.val(0).prop('disabled', true);
    }
});

$('#setting-modal').on('input', 'input[type="number"]', (event) => {
    const input = $(event.currentTarget);
    input.attr('data-num', input.val());
});