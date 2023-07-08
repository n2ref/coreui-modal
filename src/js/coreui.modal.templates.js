//HEAD 
window["CoreUI"]["modal"]["tpl"] = {};

window["CoreUI"]["modal"]["tpl"]["loading.html"] = "<div class=\"py-4 d-flex justify-content-center align-items-center gap-2\">\n" +
    "  <div class=\"spinner-border mr-2\"></div> <%= lang.loading %>\n" +
    "</div>\n" +
    ""; 

window["CoreUI"]["modal"]["tpl"]["modal.html"] = "<div class=\"modal fade\" id=\"coreui-modal-<%= modal.id %>\">\n" +
    "    <div class=\"modal-dialog <% if (modal.size) { %>modal-<%= modal.size %><% } %>\">\n" +
    "        <div class=\"modal-content\">\n" +
    "            <div class=\"modal-header\">\n" +
    "                <h5 class=\"modal-title\"><%- modal.title %></h5>\n" +
    "                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\"></button>\n" +
    "            </div>\n" +
    "            <div class=\"modal-body\">\n" +
    "                <%- body %>\n" +
    "            </div>\n" +
    "            <% if (modal.footer) { %>\n" +
    "            <div class=\"modal-footer\">\n" +
    "                <%- modal.footer %>\n" +
    "            </div>\n" +
    "            <% } %>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"; 
// END 