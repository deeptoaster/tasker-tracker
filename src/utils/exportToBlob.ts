import JSZip from 'jszip';

import type { Config, Tracker } from '../defs';
import {
  FILE_TYPE_DEFAULT,
  PROJECT_BASE,
  SERVICE_PREFIX,
  TAG_PREFIXES,
  TASK_APPEND_PREFIX,
  Tag,
  VariableName
} from '../defs';

const TIME_ZONE_DEFAULT = 'America/Los_Angeles';

type GlobalField =
  | 'append'
  | 'auth'
  | 'first'
  | 'get'
  | 'timestamp'
  | 'widgetBusy'
  | 'widgetFree';

type TrackerField = 'append' | 'display' | 'open' | 'profile' | 'project';

function* makeIdGenerator(): Generator<
  number,
  never,
  GlobalField | TrackerField | VariableName | number
> {
  const keys: Record<string, number> = {};
  let id = 0;
  let key = '';

  while (true) {
    key = (yield keys[key]).toString();

    if (!(key in keys)) {
      keys[key] = id;
      id += 1;
    }
  }
}

function makeBaseBlob(config: Config, now: number): Blob {
  const idGenerator = makeIdGenerator();

  idGenerator.next();

  const appendId = idGenerator.next('append').value;
  const authId = idGenerator.next('auth').value;
  const clientIdId = idGenerator.next(VariableName.CLIENT_ID).value;
  const clientSecretId = idGenerator.next(VariableName.CLIENT_SECRET).value;
  const firstId = idGenerator.next('first').value;
  const getId = idGenerator.next('get').value;
  const timestampId = idGenerator.next('timestamp').value;
  const timezoneId = idGenerator.next(VariableName.TIMEZONE).value;
  const widgetBusyId = idGenerator.next('widgetBusy').value;
  const widgetFreeId = idGenerator.next('widgetFree').value;
  const text = ['<TaskerData sr="" dvi="1" tv="5.11.14">\n'];

  text.push(
    '  <Project sr="proj0" ve="2">\n',
    `    <cdate>${now}</cdate>\n`,
    `    <name>${SERVICE_PREFIX}${PROJECT_BASE}</name>\n`,
    `    <tids>${appendId},${authId},${firstId},${getId},${timestampId},${widgetBusyId},${widgetFreeId}</tids>\n`,
    '  </Project>\n'
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${appendId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${appendId}</id>\n`,
    '    <nme>Append</nme>\n',
    '    <pri>100</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Auth</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3"/>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3">%headers</Str>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Timestamp</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3">%TIMEMS</Str>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3">%timestamp</Str>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>366</code>\n',
    '      <Bundle sr="arg0">\n',
    '        <Vals sr="val">\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES>&lt;StringArray sr=""&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;%gl_coordinates_accuracy\n',
    '3. Lat, Lon Accuracy\n',
    'In meters&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;%gl_altitude\n',
    'Altitude (meters)\n',
    'In meters&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;%gl_altitude_accuracy\n',
    'Altitude Accuracy\n',
    'In meters&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;%gl_bearing\n',
    'Bearing\n',
    'in the range 0.0–360.0; Horizontal direction of travel of this device; not related to the device orientation&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;%gl_bearing_accuracy\n',
    'Bearing Accuracy\n',
    'In degrees&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;%gl_latitude\n',
    '1. Latitude\n',
    '&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES6&gt;%gl_coordinates\n',
    'Latitude and Longitude\n',
    '&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES6&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES7&gt;%gl_longitude\n',
    '2. Longitude\n',
    '&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES7&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES8&gt;%gl_map_url\n',
    'Google Maps URL\n',
    '&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES8&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES9&gt;%gl_speed\n',
    'Speed\n',
    'In meters per second&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES9&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES10&gt;%gl_speed_accuracy\n',
    'Speed\n',
    'In meters per second&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES10&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES11&gt;%gl_time_seconds\n',
    'Time\n',
    'Time in seconds since EPOCH the location was gotten&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES11&gt;&lt;/StringArray&gt;</net.dinglisch.android.tasker.RELEVANT_VARIABLES>\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>[Ljava.lang.String;</net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>\n',
    '        </Vals>\n',
    '      </Bundle>\n',
    '      <Int sr="arg1" val="30"/>\n',
    '      <Str sr="arg2" ve="3"/>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Str sr="arg5" ve="3"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Int sr="arg7" val="1"/>\n',
    '      <Str sr="arg8" ve="3"/>\n',
    '    </Action>\n',
    '    <Action sr="act3" ve="7">\n',
    '      <code>354</code>\n',
    '      <Str sr="arg0" ve="3">%values</Str>\n',
    '      <Str sr="arg1" ve="3">%timestamp,%par2,%gl_latitude,%gl_longitude</Str>\n',
    '      <Str sr="arg2" ve="3">,</Str>\n',
    '    </Action>\n',
    '    <Action sr="act4" ve="7">\n',
    '      <code>39</code>\n',
    '      <Str sr="arg0" ve="3">%value</Str>\n',
    '      <Str sr="arg1" ve="3">%values()</Str>\n',
    '    </Action>\n',
    '    <Action sr="act5" ve="7">\n',
    '      <code>355</code>\n',
    '      <Str sr="arg0" ve="3">%row</Str>\n',
    '      <Int sr="arg1" val="9999"/>\n',
    '      <Str sr="arg2" ve="3">"%value"</Str>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act6" ve="7">\n',
    '      <code>40</code>\n',
    '    </Action>\n',
    '    <Action sr="act7" ve="7">\n',
    '      <code>339</code>\n',
    '      <Bundle sr="arg0">\n',
    '        <Vals sr="val">\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES>&lt;StringArray sr=""&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;%http_data\n',
    'Data\n',
    'Data that the server responded from the HTTP request.&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;%http_file_output\n',
    'File Output\n',
    "Will always contain the file's full path even if you specified a directory as the File to save.&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;%http_response_code\n",
    'Response Code\n',
    'The HTTP Code the server responded&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;%http_cookies\n',
    'Cookies\n',
    "The cookies the server sent in the response in the Cookie:COOKIE_VALUE format. You can use this directly in the 'Headers' field of the HTTP Request action&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;%http_headers()\n",
    'Response Headers\n',
    "The HTTP Headers the server sent in the response. Each header is in the 'key:value' format&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;%http_response_length\n",
    'Response Length\n',
    'The size of the response in bytes&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;&lt;/StringArray&gt;</net.dinglisch.android.tasker.RELEVANT_VARIABLES>\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>[Ljava.lang.String;</net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>\n',
    '        </Vals>\n',
    '      </Bundle>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg10" val="0"/>\n',
    '      <Int sr="arg11" val="0"/>\n',
    `      <Str sr="arg2" ve="3">https://content-sheets.googleapis.com/v4/spreadsheets/%par1%21A%3AZ:append</Str>\n`,
    '      <Str sr="arg3" ve="3">%headers</Str>\n',
    '      <Str sr="arg4" ve="3">valueInputOption:USER_ENTERED</Str>\n',
    `      <Str sr="arg5" ve="3">{"majorDimension":"ROWS","range":"'%${SERVICE_PREFIX}${VariableName.SHEET_NAME}'!A:Z","values":[[%row()]]}</Str>\n`,
    '      <Str sr="arg6" ve="3"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="30"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${authId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${authId}</id>\n`,
    '    <nme>Auth</nme>\n',
    '    <pri>100</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>351</code>\n',
    '      <Bundle sr="arg0">\n',
    '        <Vals sr="val">\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES>&lt;StringArray sr=""&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;%http_auth_headers\n',
    'Headers\n',
    "Use this in the HTTP Request action in the 'Headers' field to authenticate the request&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;&lt;/StringArray&gt;</net.dinglisch.android.tasker.RELEVANT_VARIABLES>\n",
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>[Ljava.lang.String;</net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>\n',
    '        </Vals>\n',
    '      </Bundle>\n',
    '      <Int sr="arg1" val="0"/>\n',
    '      <Str sr="arg10" ve="3"/>\n',
    `      <Str sr="arg2" ve="3">%${SERVICE_PREFIX}${VariableName.CLIENT_ID}</Str>\n`,
    `      <Str sr="arg3" ve="3">%${SERVICE_PREFIX}${VariableName.CLIENT_SECRET}</Str>\n`,
    '      <Str sr="arg4" ve="3">https://accounts.google.com/o/oauth2/v2/auth</Str>\n',
    '      <Str sr="arg5" ve="3">https://www.googleapis.com/oauth2/v4/token</Str>\n',
    '      <Str sr="arg6" ve="3">https://www.googleapis.com/auth/spreadsheets</Str>\n',
    '      <Int sr="arg7" val="0"/>\n',
    '      <Int sr="arg8" val="30"/>\n',
    '      <Str sr="arg9" ve="3"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>126</code>\n',
    '      <Str sr="arg0" ve="3">%http_auth_headers</Str>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${firstId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${firstId}</id>\n`,
    '    <nme>First</nme>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>547</code>\n',
    '      <Str sr="arg0" ve="3">%http_data</Str>\n',
    '      <Str sr="arg1" ve="3">%par1</Str>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Int sr="arg4" val="0"/>\n',
    '      <Int sr="arg5" val="3"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>129</code>\n',
    '      <Str sr="arg0" ve="3">var cell = JSON.parse(http_data).values[0][0];</Str>\n',
    '      <Str sr="arg1" ve="3"/>\n',
    '      <Int sr="arg2" val="1"/>\n',
    '      <Int sr="arg3" val="45"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>126</code>\n',
    '      <Str sr="arg0" ve="3">%cell</Str>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${getId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${getId}</id>\n`,
    '    <nme>Get</nme>\n',
    '    <pri>100</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Auth</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3"/>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3">%headers</Str>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>339</code>\n',
    '      <Bundle sr="arg0">\n',
    '        <Vals sr="val">\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES>&lt;StringArray sr=""&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;%http_data\n',
    '  Data\n',
    '  Data that the server responded from the HTTP request.&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES0&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;%http_file_output\n',
    '  File Output\n',
    "  Will always contain the file's full path even if you specified a directory as the File to save.&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES1&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;%http_response_code\n",
    '  Response Code\n',
    '  The HTTP Code the server responded&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES2&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;%http_cookies\n',
    '  Cookies\n',
    "  The cookies the server sent in the response in the Cookie:COOKIE_VALUE format. You can use this directly in the 'Headers' field of the HTTP Request action&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES3&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;%http_headers()\n",
    '  Response Headers\n',
    "  The HTTP Headers the server sent in the response. Each header is in the 'key:value' format&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES4&gt;&lt;_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;%http_response_length\n",
    '  Response Length\n',
    '  The size of the response in bytes&lt;/_array_net.dinglisch.android.tasker.RELEVANT_VARIABLES5&gt;&lt;/StringArray&gt;</net.dinglisch.android.tasker.RELEVANT_VARIABLES>\n',
    '          <net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>[Ljava.lang.String;</net.dinglisch.android.tasker.RELEVANT_VARIABLES-type>\n',
    '        </Vals>\n',
    '      </Bundle>\n',
    '      <Int sr="arg1" val="0"/>\n',
    '      <Int sr="arg10" val="0"/>\n',
    '      <Int sr="arg11" val="0"/>\n',
    '      <Str sr="arg2" ve="3">https://content-sheets.googleapis.com/v4/spreadsheets/%par1/values/%par2</Str>\n',
    '      <Str sr="arg3" ve="3">%headers</Str>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Str sr="arg5" ve="3">{"majorDimension":"ROWS","range":"A:Z","values":[[%row()]]}</Str>\n',
    '      <Str sr="arg6" ve="3"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="30"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>126</code>\n',
    '      <Str sr="arg0" ve="3">%http_data</Str>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${timestampId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${timestampId}</id>\n`,
    '    <nme>Timestamp</nme>\n',
    '    <pri>100</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>547</code>\n',
    '      <Str sr="arg0" ve="3">%number</Str>\n',
    '      <Str sr="arg1" ve="3">%par1</Str>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Int sr="arg4" val="0"/>\n',
    '      <Int sr="arg5" val="3"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>547</code>\n',
    '      <Str sr="arg0" ve="3">%timezone</Str>\n',
    `      <Str sr="arg1" ve="3">%${SERVICE_PREFIX}Timezone</Str>\n`,
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Int sr="arg4" val="0"/>\n',
    '      <Int sr="arg5" val="3"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>129</code>\n',
    "      <Str sr=\"arg0\" ve=\"3\">var string = new Date(parseInt(number)).toLocaleString('en-US', {timeZone: timezone}).replace(',', '');</Str>\n",
    '      <Str sr="arg1" ve="3"/>\n',
    '      <Int sr="arg2" val="1"/>\n',
    '      <Int sr="arg3" val="45"/>\n',
    '    </Action>\n',
    '    <Action sr="act3" ve="7">\n',
    '      <code>126</code>\n',
    '      <Str sr="arg0" ve="3">%string</Str>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${widgetBusyId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${widgetBusyId}</id>\n`,
    '    <nme>Widget Busy</nme>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>155</code>\n',
    '      <Str sr="arg0" ve="3">%par1</Str>\n',
    '      <Str sr="arg1" ve="3">...</Str>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${widgetFreeId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${widgetFreeId}</id>\n`,
    '    <nme>Widget Free</nme>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>155</code>\n',
    '      <Str sr="arg0" ve="3">%par1</Str>\n',
    '      <Str sr="arg1" ve="3">%par1</Str>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.VARIABLE} sr="${TAG_PREFIXES[Tag.VARIABLE]}${clientIdId}">\n`,
    `    <n>%${SERVICE_PREFIX}${VariableName.CLIENT_ID}</n>\n`,
    `    <v>${config.clientId}</v>\n`,
    '  </Variable>\n'
  );

  text.push(
    `  <${Tag.VARIABLE} sr="${TAG_PREFIXES[Tag.VARIABLE]}${clientSecretId}">\n`,
    `    <n>%${SERVICE_PREFIX}${VariableName.CLIENT_SECRET}</n>\n`,
    `    <v>${config.clientSecret}</v>\n`,
    '  </Variable>\n'
  );

  text.push(
    `  <${Tag.VARIABLE} sr="${TAG_PREFIXES[Tag.VARIABLE]}${timezoneId}">\n`,
    `    <n>%${SERVICE_PREFIX}Timezone</n>\n`,
    `    <v>${
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : TIME_ZONE_DEFAULT
    }</v>\n`,
    '  </Variable>\n'
  );

  text.push('</TaskerData>\n');
  return new Blob(text, { type: FILE_TYPE_DEFAULT });
}

function makeTrackerBlob(tracker: Tracker, now: number): Blob {
  const idGenerator = makeIdGenerator();

  idGenerator.next();

  const appendId = idGenerator.next('append').value;
  const displayId = idGenerator.next('display').value;
  const openId = idGenerator.next('open').value;
  const profileId = idGenerator.next('profile').value;
  const sheetIdId = idGenerator.next(VariableName.SHEET_ID).value;
  const sheetNameId = idGenerator.next(VariableName.SHEET_NAME).value;
  const text = ['<TaskerData sr="" dvi="1" tv="5.11.14">\n'];

  text.push(
    `  <Project sr="proj0" ve="2">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <name>${SERVICE_PREFIX}${tracker.title}</name>\n`,
    `    <pids>${profileId}</pids>\n`,
    `    <tids>${appendId},${displayId},${openId},${tracker.options
      .map(
        (_option: string, optionIndex: number): number =>
          idGenerator.next(optionIndex).value
      )
      .join()}</tids>\n`,
    '  </Project>\n'
  );

  text.push(
    `  <Profile sr="prof${profileId}" ve="2">\n`,
    `    <cdate>${now}</cdate>\n`,
    '    <flags>10</flags>\n',
    `    <id>${profileId}</id>\n`,
    `    <mid0>${openId}</mid0>\n`,
    '    <Event sr="con0" ve="2">\n',
    '       <code>2000</code>\n',
    '      <pri>0</pri>\n',
    '      <App sr="arg0">\n',
    '        <appClass>net.dinglisch.android.taskerm.Tasker</appClass>\n',
    '        <appPkg>net.dinglisch.android.taskerm</appPkg>\n',
    '        <label>Tasker</label>\n',
    '      </App>\n',
    `      <Str sr="arg1" ve="3">Current ${tracker.title}</Str>\n`,
    '    </Event>\n',
    '  </Profile>\n'
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${appendId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${appendId}</id>\n`,
    `    <nme>${TASK_APPEND_PREFIX}${tracker.title}</nme>\n`,
    '    <Action sr="act0" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Widget Busy</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3">%par1</Str>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Append</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    `      <Str sr="arg2" ve="3">%${SERVICE_PREFIX}${VariableName.SHEET_ID}${tracker.title}/values/%27%${SERVICE_PREFIX}${VariableName.SHEET_NAME}${tracker.title}%27</Str>\n`,
    '      <Str sr="arg3" ve="3">%par1</Str>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>30</code>\n',
    '      <Int sr="arg0" val="0"/>\n',
    '      <Int sr="arg1" val="1"/>\n',
    '      <Int sr="arg2" val="0"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Int sr="arg4" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act3" ve="7">\n',
    '      <code>130</code>\n',
    `      <Str sr="arg0" ve="3">Display ${tracker.title}</Str>\n`,
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3"/>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act4" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Widget Free</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3">%par1</Str>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3"/>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${displayId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${displayId}</id>\n`,
    `    <nme>Display ${tracker.title}</nme>\n`,
    '    <pri>100</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">Get</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    `      <Str sr="arg2" ve="3">%${SERVICE_PREFIX}${VariableName.SHEET_ID}${tracker.title}</Str>\n`,
    '      <Str sr="arg3" ve="3">Sheet2!A1</Str>\n',
    '      <Str sr="arg4" ve="3">%http_data</Str>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act1" ve="7">\n',
    '      <code>130</code>\n',
    '      <Str sr="arg0" ve="3">First</Str>\n',
    '      <Int sr="arg1">\n',
    '        <var>%priority</var>\n',
    '      </Int>\n',
    '      <Str sr="arg2" ve="3">%http_data</Str>\n',
    '      <Str sr="arg3" ve="3"/>\n',
    '      <Str sr="arg4" ve="3">%cell</Str>\n',
    '      <Int sr="arg5" val="0"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Str sr="arg7" ve="3"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Int sr="arg9" val="0"/>\n',
    '    </Action>\n',
    '    <Action sr="act2" ve="7">\n',
    '      <code>523</code>\n',
    `      <Str sr="arg0" ve="3">Current ${tracker.title}</Str>\n`,
    '      <Str sr="arg1" ve="3">%cell</Str>\n',
    '      <Str sr="arg10" ve="3"/>\n',
    '      <Str sr="arg11" ve="3">super_tasker_notifications_created_by_me_the_developer</Str>\n',
    '      <Img sr="arg2" ve="2"/>\n',
    '      <Int sr="arg3" val="0"/>\n',
    '      <Int sr="arg4" val="1"/>\n',
    '      <Int sr="arg5" val="3"/>\n',
    '      <Int sr="arg6" val="0"/>\n',
    '      <Int sr="arg7" val="0"/>\n',
    '      <Int sr="arg8" val="0"/>\n',
    '      <Str sr="arg9" ve="3"/>\n',
    '      <ListElementItem sr="item0">\n',
    '        <label>Refresh</label>\n',
    '        <Action sr="action" ve="7">\n',
    '          <code>130</code>\n',
    `          <Str sr="arg0" ve="3">Display ${tracker.title}</Str>\n`,
    '          <Int sr="arg1">\n',
    '            <var>%priority</var>\n',
    '          </Int>\n',
    '          <Str sr="arg2" ve="3"/>\n',
    '          <Str sr="arg3" ve="3"/>\n',
    '          <Str sr="arg4" ve="3"/>\n',
    '          <Int sr="arg5" val="0"/>\n',
    '          <Int sr="arg6" val="0"/>\n',
    '          <Str sr="arg7" ve="3"/>\n',
    '          <Int sr="arg8" val="0"/>\n',
    '          <Int sr="arg9" val="0"/>\n',
    '        </Action>\n',
    '        <Img sr="icon" ve="2">\n',
    '          <nme>hd_av_replay</nme>\n',
    '        </Img>\n',
    '      </ListElementItem>\n',
    '    </Action>\n',
    '    <Action sr="act3" ve="7">\n',
    '      <code>548</code>\n',
    '      <Str sr="arg0" ve="3">%cell</Str>\n',
    '      <Int sr="arg1" val="0"/>\n',
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  text.push(
    `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${openId}">\n`,
    `    <cdate>${now}</cdate>\n`,
    `    <id>${openId}</id>\n`,
    `    <nme>Open ${tracker.title}</nme>\n`,
    '    <pri>6</pri>\n',
    '    <Action sr="act0" ve="7">\n',
    '      <code>104</code>\n',
    `      <Str sr="arg0" ve="3">https://docs.google.com/spreadsheets/d/%${SERVICE_PREFIX}${VariableName.SHEET_ID}${tracker.title}/edit</Str>\n`,
    '    </Action>\n',
    `  </${Tag.TASK}>\n`
  );

  tracker.options.forEach((option: string, optionIndex: number): void => {
    const optionId = idGenerator.next(optionIndex).value;

    text.push(
      `  <${Tag.TASK} sr="${TAG_PREFIXES[Tag.TASK]}${optionId}">\n`,
      `    <cdate>${now}</cdate>\n`,
      `    <id>${optionId}</id>\n`,
      `    <nme>${option}</nme>\n`,
      '    <pri>7</pri>\n',
      '    <Action sr="act0" ve="7">\n',
      '      <code>130</code>\n',
      `      <Str sr="arg0" ve="3">${TASK_APPEND_PREFIX}${tracker.title}</Str>\n`,
      '      <Int sr="arg1">\n',
      '        <var>%priority</var>\n',
      '      </Int>\n',
      `      <Str sr="arg2" ve="3">${option}</Str>\n`,
      '      <Str sr="arg3" ve="3"/>\n',
      '      <Str sr="arg4" ve="3"/>\n',
      '      <Int sr="arg5" val="0"/>\n',
      '      <Int sr="arg6" val="0"/>\n',
      '      <Str sr="arg7" ve="3"/>\n',
      '      <Int sr="arg8" val="0"/>\n',
      '      <Int sr="arg9" val="0"/>\n',
      '    </Action>\n',
      `  </${Tag.TASK}>\n`
    );
  });

  text.push(
    `  <${Tag.VARIABLE} sr="${TAG_PREFIXES[Tag.VARIABLE]}${sheetIdId}">\n`,
    `    <n>%${SERVICE_PREFIX}${VariableName.SHEET_ID}${tracker.title}</n>\n`,
    `    <v>${tracker.sheetId}</v>\n`,
    '  </Variable>\n'
  );

  text.push(
    `  <${Tag.VARIABLE} sr="${TAG_PREFIXES[Tag.VARIABLE]}${sheetNameId}">\n`,
    `    <n>%${SERVICE_PREFIX}${VariableName.SHEET_NAME}${tracker.title}</n>\n`,
    `    <v>${tracker.sheetName}</v>\n`,
    '  </Variable>\n'
  );

  text.push('</TaskerData>\n');
  return new Blob(text, { type: FILE_TYPE_DEFAULT });
}

export default async function exportToBlob(config: Config): Promise<Blob> {
  const now = Date.now();
  const zip = new JSZip();

  zip.file(
    `${SERVICE_PREFIX}${PROJECT_BASE}.prj.xml`,
    makeBaseBlob(config, now)
  );

  config.trackers.forEach(
    (tracker: Tracker): JSZip =>
      zip.file(
        `${SERVICE_PREFIX}${tracker.title}.prj.xml`,
        makeTrackerBlob(tracker, now)
      )
  );

  return zip.generateAsync({ type: 'blob' });
}
