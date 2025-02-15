let tpl = Object.create(null)
tpl['loading.html'] = '<div class="py-4 d-flex justify-content-center align-items-center gap-2"> <div class="spinner-border mr-2"></div> <%= lang.loading %> </div> '
tpl['modal.html'] = '<div class="modal fade" id="coreui-modal-<%= id %>"> <div class="modal-dialog <% if (modal.size) { %>modal-<%= modal.size %><% } %>"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title"><%- modal.title %></h5> <button type="button" class="btn-close" data-bs-dismiss="modal"></button> </div> <div class="modal-body"></div> <% if (modal.footer) { %> <div class="modal-footer"></div> <% } %> </div> </div> </div>';
export default tpl;