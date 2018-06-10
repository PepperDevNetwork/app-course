<?xml version="1.0" encoding="UTF-8" ?>
<Package name="BoxTest" format_version="4">
    <Manifest src="manifest.xml" />
    <BehaviorDescriptions>
        <BehaviorDescription name="behavior" src="." xar="behavior.xar" />
    </BehaviorDescriptions>
    <Dialogs>
        <Dialog name="interaction" src="dialog/interaction/interaction.dlg" />
    </Dialogs>
    <Resources>
        <File name="desktop" src="desktop.ini" />
    </Resources>
    <Topics>
        <Topic name="interaction_jpj" src="dialog/interaction/interaction_jpj.top" topicName="interaction" language="ja_JP" />
    </Topics>
    <IgnoredPaths />
    <Translations auto-fill="en_US">
        <Translation name="translation_en_US" src="translations/translation_en_US.ts" language="en_US" />
    </Translations>
</Package>
