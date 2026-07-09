-- Re-lay the 8 dummy rows into two rows with a clear gap for the
-- title in the middle, matching the spacing in the Figma reference.
update media_entries set x = 150,  y = 100 where source = 'dummy' and source_id = '1';
update media_entries set x = 520,  y = 100 where source = 'dummy' and source_id = '2';
update media_entries set x = 890,  y = 100 where source = 'dummy' and source_id = '3';
update media_entries set x = 1260, y = 100 where source = 'dummy' and source_id = '4';
update media_entries set x = 150,  y = 650 where source = 'dummy' and source_id = '5';
update media_entries set x = 520,  y = 650 where source = 'dummy' and source_id = '6';
update media_entries set x = 890,  y = 650 where source = 'dummy' and source_id = '7';
update media_entries set x = 1260, y = 650 where source = 'dummy' and source_id = '8';
