<?xml version="1.0" encoding="UTF-8" ?>
<Package name="Sample" format_version="4">
    <Manifest src="manifest.xml" />
    <BehaviorDescriptions>
        <BehaviorDescription name="behavior" src="." xar="behavior.xar" />
    </BehaviorDescriptions>
    <Dialogs>
        <Dialog name="interaction" src="dialog/interaction/interaction.dlg" />
    </Dialogs>
    <Resources>
        <File name="app" src="html/css/app.css" />
        <File name="default" src="html/css/default.css" />
        <File name="reset" src="html/css/reset.css" />
        <File name="index" src="html/index.html" />
        <File name="Sample" src="Sample.phpproj" />
        <File name="adjust" src="html/js/adjust.js" />
        <File name="se_quiz_failure" src="html/audio/se_quiz_failure.ogg" />
        <File name="se_quiz_start" src="html/audio/se_quiz_start.ogg" />
        <File name="se_quiz_success" src="html/audio/se_quiz_success.ogg" />
        <File name="bgm" src="html/audio/bgm.ogg" />
        <File name="app" src="app.cnf" />
        <File name="Sample" src="Sample.sln" />
        <File name="contents" src="html/js/contents.js" />
        <File name="tapper" src="html/js/tapper.js" />
        <File name="tapper_audio" src="html/js/tapper_audio.js" />
        <File name="bg_common" src="html/images/preloads/bg_common.png" />
        <File name="bg_splash" src="html/images/preloads/bg_splash.png" />
        <File name="text_correct" src="html/images/preloads/text_correct.png" />
        <File name="text_incorrect" src="html/images/preloads/text_incorrect.png" />
        <File name="se_btn_touched" src="html/audio/se_btn_touched.ogg" />
        <File name="tapper_preview" src="html/js/tapper_preview.js" />
    </Resources>
    <Topics>
        <Topic name="interaction_jpj" src="dialog/interaction/interaction_jpj.top" topicName="interaction" language="ja_JP" />
    </Topics>
    <IgnoredPaths />
    <Translations auto-fill="ja_JP">
        <Translation name="translation_ja_JP" src="translations/translation_ja_JP.ts" language="ja_JP" />
    </Translations>
</Package>
