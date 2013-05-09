configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :relative_assets
end

activate :livereload, :apply_js_live => false, :grace_period => 0.5