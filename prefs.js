import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ObisionExtensionDeskPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Create a preferences page
        const page = new Adw.PreferencesPage({
            title: 'General',
            icon_name: 'user-desktop-symbolic',
        });
        window.add(page);

        // Icon Settings Group
        const iconGroup = new Adw.PreferencesGroup({
            title: 'Icon Settings',
            description: 'Configure desktop icon appearance',
        });
        page.add(iconGroup);

        // Default Icon Size (in cells)
        const iconSizeRow = new Adw.ComboRow({
            title: 'Default Icon Size',
            subtitle: 'Default size for new icons (in grid cells)',
        });
        const sizeModel = new Gtk.StringList();
        sizeModel.append('1×1 (1 cell)');
        sizeModel.append('2×2 (4 cells)');
        sizeModel.append('3×3 (9 cells)');
        sizeModel.append('4×4 (16 cells)');
        iconSizeRow.set_model(sizeModel);

        // Map settings value to index
        const sizeMap = { '1x1': 0, '2x2': 1, '3x3': 2, '4x4': 3 };
        const reverseSizeMap = ['1x1', '2x2', '3x3', '4x4'];
        const currentSize = settings.get_string('icon-size');
        iconSizeRow.set_selected(sizeMap[currentSize] ?? 0);

        iconSizeRow.connect('notify::selected', () => {
            const selected = iconSizeRow.get_selected();
            settings.set_string('icon-size', reverseSizeMap[selected]);
        });
        iconGroup.add(iconSizeRow);

        // Show Hidden Files
        const showHiddenRow = new Adw.SwitchRow({
            title: 'Show Hidden Files',
            subtitle: 'Display files and folders starting with a dot',
        });
        iconGroup.add(showHiddenRow);
        settings.bind('show-hidden', showHiddenRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Auto Icon Background (tile style)
        const iconBackgroundRow = new Adw.SwitchRow({
            title: 'Auto Icon Background',
            subtitle: 'Use dominant color from icon as tile background',
        });
        iconGroup.add(iconBackgroundRow);
        settings.bind('icon-background-auto', iconBackgroundRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Grid Settings Group
        const gridGroup = new Adw.PreferencesGroup({
            title: 'Grid Settings',
            description: 'Configure icon grid layout',
        });
        page.add(gridGroup);

        // Grid Columns
        const gridColumnsRow = new Adw.SpinRow({
            title: 'Grid Columns',
            subtitle: 'Number of columns in the desktop grid',
            adjustment: new Gtk.Adjustment({
                lower: 4,
                upper: 32,
                step_increment: 1,
                page_increment: 4,
            }),
        });
        gridGroup.add(gridColumnsRow);
        settings.bind('grid-columns', gridColumnsRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Grid Rows
        const gridRowsRow = new Adw.SpinRow({
            title: 'Grid Rows',
            subtitle: 'Number of rows in the desktop grid',
            adjustment: new Gtk.Adjustment({
                lower: 3,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        gridGroup.add(gridRowsRow);
        settings.bind('grid-rows', gridRowsRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Use Grid
        const useGridRow = new Adw.SwitchRow({
            title: 'Use Grid',
            subtitle: 'Snap icons to a grid layout',
        });
        gridGroup.add(useGridRow);
        settings.bind('use-grid', useGridRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Grid Visible
        const gridVisibleRow = new Adw.SwitchRow({
            title: 'Show Grid',
            subtitle: 'Display the grid lines on the desktop',
        });
        gridGroup.add(gridVisibleRow);
        settings.bind('grid-visible', gridVisibleRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Grid Dots Only
        const gridDotsRow = new Adw.SwitchRow({
            title: 'Grid Dots Only',
            subtitle: 'Show only dots at intersections instead of lines',
        });
        gridGroup.add(gridDotsRow);
        settings.bind('grid-dots-only', gridDotsRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Grid Line Pattern
        const gridPatternRow = new Adw.ComboRow({
            title: 'Grid Line Pattern',
            subtitle: 'Pattern of grid lines (when dots only is off)',
        });
        const patternModel = new Gtk.StringList();
        patternModel.append('Solid');
        patternModel.append('Dashed');
        patternModel.append('Dotted');
        gridPatternRow.set_model(patternModel);

        const patternMap = { solid: 0, dashed: 1, dotted: 2 };
        const reversePatternMap = ['solid', 'dashed', 'dotted'];
        const currentPattern = settings.get_string('grid-line-pattern');
        gridPatternRow.set_selected(patternMap[currentPattern] ?? 0);

        gridPatternRow.connect('notify::selected', () => {
            const selected = gridPatternRow.get_selected();
            settings.set_string('grid-line-pattern', reversePatternMap[selected]);
        });
        gridGroup.add(gridPatternRow);

        // Grid Color
        const gridColorRow = new Adw.EntryRow({
            title: 'Grid Color',
        });
        gridColorRow.set_text(settings.get_string('grid-color'));
        gridColorRow.connect('changed', () => {
            settings.set_string('grid-color', gridColorRow.get_text());
        });
        gridGroup.add(gridColorRow);

        // Grid Line Width
        const gridLineWidthRow = new Adw.SpinRow({
            title: 'Grid Line Width',
            subtitle: 'Width of grid lines in pixels',
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 4,
                step_increment: 1,
                page_increment: 1,
            }),
        });
        gridGroup.add(gridLineWidthRow);
        settings.bind('grid-line-width', gridLineWidthRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Grid Spacing
        const gridSpacingRow = new Adw.SpinRow({
            title: 'Grid Spacing',
            subtitle: 'Space between icons in pixels',
            adjustment: new Gtk.Adjustment({
                lower: 4,
                upper: 48,
                step_increment: 2,
                page_increment: 8,
            }),
        });
        gridGroup.add(gridSpacingRow);
        settings.bind('grid-spacing', gridSpacingRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Sort By
        const sortByRow = new Adw.ComboRow({
            title: 'Sort By',
            subtitle: 'How to sort desktop icons',
        });
        const sortModel = new Gtk.StringList();
        sortModel.append('Name');
        sortModel.append('Modified Date');
        sortModel.append('Size');
        sortModel.append('Type');
        sortByRow.set_model(sortModel);

        const sortMap = { name: 0, modified: 1, size: 2, type: 3 };
        const reverseSortMap = ['name', 'modified', 'size', 'type'];
        const currentSort = settings.get_string('sort-by');
        sortByRow.set_selected(sortMap[currentSort] ?? 0);

        sortByRow.connect('notify::selected', () => {
            const selected = sortByRow.get_selected();
            settings.set_string('sort-by', reverseSortMap[selected]);
        });
        gridGroup.add(sortByRow);

        // Behavior Group
        const behaviorGroup = new Adw.PreferencesGroup({
            title: 'Behavior',
            description: 'Configure desktop behavior',
        });
        page.add(behaviorGroup);

        // Single Click to Open
        const singleClickRow = new Adw.SwitchRow({
            title: 'Single Click to Open',
            subtitle: 'Open files with a single click instead of double click',
        });
        behaviorGroup.add(singleClickRow);
        settings.bind('single-click', singleClickRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Show Trash Icon
        const showTrashRow = new Adw.SwitchRow({
            title: 'Show Trash Icon',
            subtitle: 'Display the trash can on desktop',
        });
        behaviorGroup.add(showTrashRow);
        settings.bind('show-trash', showTrashRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Show Home Icon
        const showHomeRow = new Adw.SwitchRow({
            title: 'Show Home Icon',
            subtitle: 'Display home folder on desktop',
        });
        behaviorGroup.add(showHomeRow);
        settings.bind('show-home', showHomeRow, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}
