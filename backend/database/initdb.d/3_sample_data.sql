USE discord_clone_database;
INSERT INTO user (id, name) VALUES (1, 'kntk');
INSERT INTO user (id, name) VALUES (2, 'kntk ymt');

INSERT INTO chat_server (id, name) VALUES (1, 'test');
INSERT INTO chat_server (id, name) VALUES (2, 'demo');
INSERT INTO chat_server (id, name) VALUES (3, 'noone');

INSERT INTO chat_server_user (chat_server_id, user_id) VALUES (1, 1);
INSERT INTO chat_server_user (chat_server_id, user_id) VALUES (1, 2);
INSERT INTO chat_server_user (chat_server_id, user_id) VALUES (2, 1);

INSERT INTO message (id, content, channel_id, user_id) VALUES (1, "アイウエオ", 1, 1);
INSERT INTO message (id, content, channel_id, user_id) VALUES (2, "かきくけこ", 1, 1);
INSERT INTO message (id, content, channel_id, user_id) VALUES (3, "wwwwww", 2, 2);

INSERT INTO channel (id, name, chat_server_id) VALUES (1, 'sindoi', 1);
INSERT INTO channel (id, name, chat_server_id) VALUES (2, 'tweet', 1);
INSERT INTO channel (id, name, chat_server_id) VALUES (3, 'general', 1);

INSERT INTO channel (id, name, chat_server_id) VALUES (4, 'テスト', 2);

INSERT INTO channel (id, name, chat_server_id) VALUES (5, 'empty', 3);