(function updateCopyOfTopicContentInstances() {
    var WIDGET_SYS_ID = '8f32bbadc37ff2506b68770d050131db';
    var OPTION_NAME = 'content_displayed_from';
    var CURRENT_TOPIC_ONLY = 'Current topic only';

    var instanceGr = new GlideRecord('sp_instance');
    var widgetField = instanceGr.isValidField('sp_widget') ? 'sp_widget' : 'widget';
    if (!instanceGr.isValidField(widgetField) || !instanceGr.isValidField('options')) {
        gs.error('Copy of Topic Content migration: sp_instance widget/options fields were not found.');
        return;
    }

    instanceGr.addQuery(widgetField, WIDGET_SYS_ID);
    instanceGr.query();

    var checked = 0;
    var updated = 0;

    while (instanceGr.next()) {
        checked++;

        var rawOptions = instanceGr.getValue('options') || '{}';
        var options;
        try {
            options = JSON.parse(rawOptions);
        } catch (parseErr) {
            gs.warn('Copy of Topic Content migration: skipped instance ' + instanceGr.getUniqueValue() + '; options is not valid JSON.');
            continue;
        }

        if (options[OPTION_NAME] === CURRENT_TOPIC_ONLY) {
            continue;
        }

        options[OPTION_NAME] = CURRENT_TOPIC_ONLY;
        instanceGr.setValue('options', JSON.stringify(options));
        instanceGr.update();
        updated++;
    }

    gs.info('Copy of Topic Content migration: checked ' + checked + ' instance(s), updated ' + updated + '.');
})();
