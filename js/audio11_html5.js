/*
 * CLEVER - HTML5 Radio Player With History - Shoutcast and Icecast - v2.0
 * Copyright 2019-2020, LambertGroup
 *
 */

(function($) {
"use strict";

	//vars
	var val = navigator.userAgent.toLowerCase();

	//functions
	function supports_mp3_audio(current_obj) {
			  var a = document.getElementById(current_obj.audioID);
			  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	}

	function UrlExists(url)
	{
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			//console.log(url+'   ----   '+http.status);
			return http.status!=404;
	}

			function playBarsAnimation(options,current_obj,audio11_html5_container) {
						$('.audio11_sound', audio11_html5_container).css({
							'-webkit-animation-play-state':'running',
							'-moz-animation-play-state':'running',
							'-ms-animation-play-state':'running',
							'-o-animation-play-state':'running',
							'animation-play-state':'running'
						});
						$('.audio11_sound2', audio11_html5_container).css({
							'-webkit-animation-play-state':'running',
							'-moz-animation-play-state':'running',
							'-ms-animation-play-state':'running',
							'-o-animation-play-state':'running',
							'animation-play-state':'running'
						});
			}

			function pauseBarsAnimation(options,current_obj,audio11_html5_container) {

						$('.audio11_sound', audio11_html5_container).css({
							'-webkit-animation-play-state':'paused',
							'-moz-animation-play-state':'paused',
							'-ms-animation-play-state':'paused',
							'-o-animation-play-state':'paused',
							'animation-play-state':'paused'
						});
						$('.audio11_sound2', audio11_html5_container).css({
							'-webkit-animation-play-state':'paused',
							'-moz-animation-play-state':'paused',
							'-ms-animation-play-state':'paused',
							'-o-animation-play-state':'paused',
							'animation-play-state':'paused'
						});
			}

			function removeAccents(str) {
				var temp_str;
			  var accents = "ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž’";
			  var accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'";
				var i;
			  str = str.split('');
			  str.forEach(function(letter, index){
			    i = accents.indexOf(letter);
			    if (i != -1) {
			      str[index] = accentsOut[i];
			    }
			  })
			  temp_str=str.join('');
				return temp_str.trim();
			}



		function capitalizeFirstLetter(str,options) {
					if (!options.preserveOriginalUpperLowerCase) {
							//return str.replace(/(\b\w)/gi,function(m){return m.toUpperCase();});
							str=str.toLowerCase();
							str=str.replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
							/*str=str.replace("'S","'s");
							str=str.replace("'T","'t");*/
							str=str.replace(/&Apos;/gi,"'");
							str=str.replace(/&Amp;/gi,"&");
							str=str.replace(/'[A-Z]/g,function(f){return f.toLowerCase();});
					}
					return str;
		}


		function textLimit(the_text,limit,options) {
			the_text=String(the_text);
			var points='';
			var textLength=the_text.length;
			//alert (textLength);
			var lastLetter;
			var words;
			if (textLength>limit) {
				the_text=the_text.substring(0, limit);
				//words = the_text.split(/\b[\s,\.-:;]*/);
				words = the_text.split(' ');
				lastLetter=the_text.substring(limit-2, limit-1);
				if (lastLetter!='') {
					words.pop();
					points='...';
				}
				the_text=words.join(" ");
			}

			the_text=capitalizeFirstLetter(the_text,options);
			return the_text+points;
		}

		function generateHistory(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding) {
						audio11_html5_thumbsHolder.empty();
						var d = new Date();
						var temp_date;
						var temp_date_arr;
						var orig_time_arr;
						//var temp_m=d;
						var hours_diff=0;
						for (var i=0; i<current_obj.title_arr.length; i++) {

										if (!options.useRadioServerTime && i===0) {
											///console.log(i+':  '+current_obj.time_arr[i]);
											orig_time_arr=current_obj.time_arr[i].split(':'); /*orig_time_arr[0] - hours*/
											//temp_h=orig_time_arr[0];
											hours_diff=d.getHours()- orig_time_arr[0];
											///console.log(i+':  '+orig_time_arr[0]+'   -  '+hours_diff);
										}

										if (!options.useRadioServerTime) {
												temp_date_arr=current_obj.time_arr[i].split(':');
												temp_date_arr[0]=parseInt(temp_date_arr[0],10)+hours_diff;
												if (parseInt(temp_date_arr[0],10)>24) {
														temp_date_arr[0]=parseInt(temp_date_arr[0],10)-24;
												}
												if (parseInt(temp_date_arr[0],10)<0) {
														temp_date_arr[0]=24+parseInt(temp_date_arr[0],10);
												}
												if (parseInt(temp_date_arr[0],10)<=9) {
													temp_date_arr[0]="0"+parseInt(temp_date_arr[0],10);
												}
												current_obj.time_arr[i]=temp_date_arr.join(':');
												///console.log(i+':  '+current_obj.time_arr[i]);
										}
										current_obj.thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ i +'"><div class="padding"><span class="timex">'+String(current_obj.time_arr[i]).substring(0, String(current_obj.time_arr[i]).length - 3)+'</span><div class="img_div" style="background-image:url('+current_obj.image_arr[i]+');background-color:#000000;"></div><span class="titlex">'+textLimit(current_obj.title_arr[i],900,options)+'</span><span class="authorx">'+textLimit(current_obj.artist_arr[i],900,options)+'</span></div></div>');
										audio11_html5_thumbsHolder.append(current_obj.thumbsHolder_Thumb);
										/*if (current_obj.thumbsHolder_ThumbHeight==0) {
											current_obj.thumbsHolder_ThumbHeight=current_obj.thumbsHolder_Thumb.height();
										}*/

										$('.titlex',current_obj.thumbsHolder_Thumb).css({
											'height':current_obj.songTitleHeight+'px',
											'font-size':((i===current_obj.activeRecordId)?current_obj.songTitleFontSize+1:current_obj.songTitleFontSize)+'px'
										});
										$('.authorx',current_obj.thumbsHolder_Thumb).css({
											'height':current_obj.songAuthorHeight+'px'
										});
										current_obj.thumbsHolder_Thumb.css({
											"top":(current_obj.thumbsHolder_ThumbHeight+1)*i+'px',
										});
										if (i===current_obj.activeRecordId) {
											current_obj.thumbsHolder_Thumb.css({
												"margin-bottom":current_obj.activeRecordMarginBottom+'px',
											});
										}

										$('.timex',current_obj.thumbsHolder_Thumb).css({
											"color":options.historyRecordTimeOffColor
										});

										$('.titlex',current_obj.thumbsHolder_Thumb).css({
											"color":options.historyRecordSongOffColor,
											"border-bottom-color":options.songAuthorLineSeparatorOffColor
										});

										$('.authorx',current_obj.thumbsHolder_Thumb).css({
											"color":options.historyRecordAuthorOffColor
										});
										if (i===current_obj.activeRecordId){
												positionElementsForActiveRecord(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder);
										}
						}


						audio11_html5_thumbsHolderWrapper.height(options.historyTopPadding+options.historyBottomPadding+current_obj.thumbsHolder_ThumbHeight*current_obj.title_arr.length); //current_obj.thumbsHolder_ThumbHeight+1 - 1 is the border
						audio11_html5_thumbsHolderVisibleWrapper.height((current_obj.thumbsHolder_ThumbHeight+1)*current_obj.title_arr.length);
						audio11_html5_historyPadding.css({
							'padding-top':options.historyTopPadding+'px',
							'padding-bottom':options.historyBottomPadding+'px',
							'padding-left':current_obj.historyLeftPadding+'px',
							'padding-right':current_obj.historyRightPadding+'px'
						});
						audio11_html5_thumbsHolder.width(current_obj.playerWidth-current_obj.historyLeftPadding-current_obj.historyRightPadding);
		}


		function get_wiki_image_history(temp_artist_image,current_obj,options,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,the_p) {
						var photo_path=options.noImageAvailable;
						var generateHistory_Timeout;
						var ext_2="";
						var temp_iiurlparam_2="";
						if (temp_artist_image!='' && temp_artist_image!=undefined) {
								ext_2 = temp_artist_image.match(/\.([^\./\?\#]+)($|\?|\#)/)[1];
								if (ext_2=="jpg" || ext_2=="jpeg" || ext_2=="JPG" || ext_2=="JPEGs") {
										temp_iiurlparam_2="&iiurlparam=qlow-200px";
								}
								//$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url", {}, function( xml ) {
								$.get( "https://commons.wikimedia.org/w/api.php?action=query&titles=Image:"+temp_artist_image+"&prop=imageinfo&format=xml&origin=*&iiprop=url"+temp_iiurlparam_2, {}, function( xml ) {
											///console.log("!!!!HISTORY the image: ");console.log(xml);
											///console.log($("ii", xml).attr('url'));
											if ($("ii", xml).attr('thumburl')!='' && $("ii", xml).attr('thumburl')!=undefined) {
															photo_path=$("ii", xml).attr('thumburl');
											} else {
														if ($("ii", xml).attr('url')!='' && $("ii", xml).attr('url')!=undefined) {
															photo_path=$("ii", xml).attr('url');
														}
											}
											///console.log(the_p+'   ---  '+photo_path);
											current_obj.image_arr[the_p]=photo_path;
											var the_record=$('div[rel="'+the_p+'"]',audio11_html5_thumbsHolder);
											//var the_record_padding=$('padding',audio11_html5_thumbsHolder);
											$('.img_div',the_record).css({
												"background-image":"url('"+current_obj.image_arr[the_p]+"')",
												"background-color":"#000000"
											})
								});
						}
		}

		function generateHistoryImages(options,current_obj,audio11_html5_container,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,audio11_html5_play_btn,the_p) {
				var photo_path;
				var temp_artist_image;
				if (options.grabArtistPhoto) {
								current_obj.musicbrainzHistory_setTimeout_arr[the_p]=setTimeout(function(){
													var author_arr=current_obj.artist_arr[the_p].split('-');
													///console.log(the_p+' - '+current_obj.artist_arr[the_p]);
													author_arr[0]=author_arr[0].trim();
													if (author_arr.length>=2) {
														author_arr[0]=author_arr[0].trim()+'-'+author_arr[1].trim();
													}
													current_obj.the_artist_id_history_arr[the_p]='';
													current_obj.the_wikidata_id_history_arr[the_p]='';
													photo_path=options.noImageAvailable;
													current_obj.wiki_photo_path=photo_path;
													clearTimeout(current_obj.musicbrainzHistory_setTimeout_arr[the_p]);
													author_arr[0]=author_arr[0].trim();
													///console.log("!!!!!!!!!!!!!!!!---------history--------------!!!!!!!!!!!!!!!!!!!!!!!");
													if (options.optional_images_path!='') {
																	//console.log(current_obj.artist_arr[the_p]+'    -----   '+current_obj.title_arr[the_p]);
																	temp_artist_image=options.optional_images_path+current_obj.artist_arr[the_p]+' - '+current_obj.title_arr[the_p]+'.jpg';
																	temp_artist_image=encodeURI(temp_artist_image);
																	//console.log(temp_artist_image);
																	//temp_artist_image=encodeURIComponent(temp_artist_image);
																	//temp_artist_image="https://christunveiled.org/coverart/Isabel%20Davis%20-%20Wide%20as%20the%20Sky%20(Live).jpg";
																	//temp_artist_image="https://christunveiled.org/coverart/Isabel%20Davis%20-%20Wide%20as%20the%20Sky%20%28Live%29.jpg";
																	temp_artist_image=temp_artist_image.replace("(", "%28");
																	temp_artist_image=temp_artist_image.replace(")", "%29");
																	temp_artist_image=temp_artist_image.replace("&apos;", "%27");
																	temp_artist_image=temp_artist_image.replace("&amp;", "%26");
																	if (!UrlExists(temp_artist_image)) {
																			temp_artist_image=options.noImageAvailable;
																	}
																	//console.log(temp_artist_image);
																	//get_wiki_image_history(temp_artist_image,current_obj,options,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,the_p);
																	current_obj.image_arr[the_p]=temp_artist_image;
																	var the_record=$('div[rel="'+the_p+'"]',audio11_html5_thumbsHolder);
																	$('.img_div',the_record).css({
																		"background-image":"url('"+current_obj.image_arr[the_p]+"')",
																		"background-color":"#000000"
																	})
													} else {
															$.get( "https://musicbrainz.org/ws/2/artist/?query=artist:"+author_arr[0], {}, function( xml ) {
																		///console.log(the_p+'  --  '+author_arr[0]);
																		var now_artist_name;
																		var temp_artist_name='';
																		var xmlLine_name;
																		var temp_artist_image='';
																		current_obj.the_artist_id_history_arr[the_p]='';
																		///console.log("first: ");console.log(xml);
																		now_artist_name=author_arr[0];
																		now_artist_name=now_artist_name.toLowerCase();
																		now_artist_name=removeAccents(now_artist_name);
																		$("artist", xml).each(function(){
																					xmlLine_name = $("name", this)[0];
																					if ($("name", this).length>0 && current_obj.the_artist_id_history_arr[the_p]=='') {
																							 temp_artist_name=$(xmlLine_name).text();
																							 temp_artist_name=temp_artist_name.toLowerCase();
																							 temp_artist_name=removeAccents(temp_artist_name);
																							 if (now_artist_name.toLowerCase()==temp_artist_name.toLowerCase()){
																										current_obj.the_artist_id_history_arr[the_p]=$(this).attr('id');
																							 }
																					}
																	 });

																	 ///console.log($("artist", xml)[0]);
																	 ///console.log($($("artist", xml)[0]).attr('id'));
																	 ///console.log("artist id1:"+current_obj.the_artist_id_history_arr[the_p]);
																	 if (current_obj.the_artist_id_history_arr[the_p]=='' && author_arr[0]!='ROCK RADIO') {
																			current_obj.the_artist_id_history_arr[the_p]=$($("artist", xml)[0]).attr('id');
																	 }
																	///console.log("artist id2:"+current_obj.the_artist_id_history_arr[the_p]);
																	 if (current_obj.the_artist_id_history_arr[the_p]!='' && current_obj.the_artist_id_history_arr[the_p]!=undefined) {
																				 current_obj.musicbrainzHistory_setTimeout_arr[the_p]=setTimeout(function() {
																								current_obj.the_wikidata_id_history_arr[the_p]='';
																								///console.log("artist id2bis:"+current_obj.the_artist_id_history_arr[the_p]);
																								$.get( "https://musicbrainz.org/ws/2/artist/"+current_obj.the_artist_id_history_arr[the_p]+"?inc=url-rels", {}, function( xml ) {
																											///console.log("url-rels: ");console.log(xml);
																											$("relation", xml).each(function(){
																														if ($(this).attr('type')=='image'){
																																		if ($("target", this).length>0) {
																																				temp_artist_image=$("target", this).text();
																																				///console.log(temp_artist_image);
																																				temp_artist_image=temp_artist_image.substr(temp_artist_image.indexOf('File:',10)+5, temp_artist_image.length);
																																				///console.log(temp_artist_image);
																																				get_wiki_image_history(temp_artist_image,current_obj,options,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,the_p);
																																		}
																														} //('type')=='image'

																														if ($(this).attr('type')=='wikidata') {
																																	if ($("target", this).length>0 && temp_artist_image=='') {
																																			///console.log($("target", this).text());
																																			current_obj.the_wikidata_id_history_arr[the_p]=$("target", this).text();
																																			//https://www.wikidata.org/wiki/
																																			current_obj.the_wikidata_id_history_arr[the_p]=current_obj.the_wikidata_id_history_arr[the_p].substr(current_obj.the_wikidata_id_history_arr[the_p].indexOf('/Q',10)+1, current_obj.the_wikidata_id_history_arr[the_p].length);
																																			///console.log(current_obj.the_wikidata_id_history_arr[the_p]);
																																			$.get( "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity="+current_obj.the_wikidata_id_history_arr[the_p]+"&property=P18&format=xml&origin=*", {}, function( xml ) {
																																						///console.log("!!!!!!!!!!!!wiki!!!!!!!!!!!!!! ");console.log(xml);
																																						temp_artist_image=$("datavalue", $("mainsnak", xml)).attr("value");
																																						///console.log(temp_artist_image);
																																						get_wiki_image_history(temp_artist_image,current_obj,options,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,the_p);
																																			});
																																	}
																														} // ('type')=='wikidata'
																											});

																											if (temp_artist_image=='' || temp_artist_image==undefined) {
																													current_obj.image_arr[the_p]=photo_path;
																											}
																								});
																				}, (the_p+1)*1100);
																	 }
															});
												}
								}, (the_p+1)*1100);
				}
		}


		function get_now_playing(options,current_obj,audio11_html5_container,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars) {
				return;
				$.get( options.pathToAjaxFiles+"now_playing.php", {the_stream:options.radio_stream,'_': $.now()}, function( data ) {
							var temp_title='';
							var temp_artist='';
							var temp_time='';
							var temp_image='';
							///console.log(data);

							///console.log("now_playing_interval:"+data);
							var data_temp=data.split("-");
							if (data_temp[0]===undefined) {
								data_temp[0]='';
							}
							if (data_temp[1]===undefined) {
								data_temp[1]='';
							}
							if (data_temp.length>=3) {
									data_temp[0]=data_temp[0]+'-'+data_temp[1];
									data_temp[1]=data_temp[2];
							}
							//console.log($("song", data).attr('title'));
							temp_title=data_temp[1].trim();
							temp_artist=data_temp[0].trim();
							temp_time='now:0:0';
							temp_image=options.noImageAvailable;

							if (temp_title!=current_obj.title_arr[0]) {
									current_obj.title_arr.unshift( temp_title);
									current_obj.artist_arr.unshift( temp_artist);
									current_obj.time_arr.unshift( temp_time);
									current_obj.image_arr.unshift( temp_image );

									current_obj.time_arr[0]=getCurentSongTime(options,current_obj);
									if (current_obj.title_arr.length>options.numberOfElementsDisplayed) {
											current_obj.title_arr.splice(-1,1);
											current_obj.artist_arr.splice(-1,1);
											current_obj.time_arr.splice(-1,1);
											current_obj.image_arr.splice(-1,1);
									}
									generateHistory(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding);
									//positionElementsForActiveRecord(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder);
									generateHistoryImages(options,current_obj,audio11_html5_container,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,audio11_html5_play_btn,0);
							}
				});
		}


		function positionElementsForActiveRecord(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder) {
			  //clearTimeout(current_obj.positionElementsForActiveRecord_timeout);
				//current_obj.positionElementsForActiveRecord_timeout=setTimeout(function() {
								var activeRecord=$('div[rel="'+current_obj.activeRecordId+'"]',audio11_html5_thumbsHolder);
								//alert (audio11_html5_play_btn.height());
								audio11_html5_play_btn.css({
										'display':'block',
										'top':options.historyTopPadding+(current_obj.thumbsHolder_ThumbHeight+1)*current_obj.activeRecordId+parseInt((current_obj.thumbsHolder_ThumbHeight-current_obj.playBtnHeight)/2,10)+'px',
										'right':current_obj.historyRightPadding+current_obj.playButAddtionalRightMargin+'px',
										'border-left-color':options.playButtonColor,
										'border-right-color':options.playButtonColor
								});
								audio11_html5_the_bars.css({
										'display':current_obj.barsCurDisplay,
										'top':options.historyTopPadding+(current_obj.thumbsHolder_ThumbHeight+1)*current_obj.activeRecordId+parseInt((current_obj.thumbsHolder_ThumbHeight-current_obj.playBtnHeight)/2,10)+'px',
										'left':current_obj.playerWidth-current_obj.historyRightPadding-80-165+'px'
								});

								audio11_html5_ximg_frame.css({
										'display':'block',
										'top':options.historyTopPadding+(current_obj.thumbsHolder_ThumbHeight+1)*current_obj.activeRecordId-13+'px',
										'left':current_obj.historyLeftPadding+51+'px'
								});

								$('.timex',activeRecord).css({
									"color":options.historyRecordTimeOnColor
								});

								$('.titlex',activeRecord).css({
									"color":options.historyRecordSongOnColor,
									"border-bottom-color":options.songAuthorLineSeparatorOnColor
								});

								$('.authorx',activeRecord).css({
									"color":options.historyRecordAuthorOnColor
								});

								activeRecord.addClass( "thumbsHolder_ThumbON" );

								activeRecord.css({
									'background-color':options.historyRecordBackgroundOnColor
								});



				//}, 100 );
		}


		function getCurentSongTime (options,current_obj) {
			var cur_song_time='00:00:00';
			var d = new Date();
			var temp_h=d.getHours();
			var temp_m=d.getMinutes();
			var prev_time_arr;

			if (current_obj.time_arr.length>1) {
				prev_time_arr=current_obj.time_arr[1].split(':');
				temp_h=prev_time_arr[0];
				temp_h=parseInt(temp_h,10);
				if (prev_time_arr[1]>temp_m) { //prev min bigger than current min
						temp_h++;
						if (temp_h==24) {
							temp_h=0;
						}
				}
			}

			if (temp_h<=9) {
				temp_h="0"+parseInt(temp_h,10);
			}
			if (temp_m<=9) {
				temp_m="0"+parseInt(temp_m,10);
			}
			cur_song_time=temp_h+':'+temp_m+':00';
			return cur_song_time;

		}

		function cancelAll() {
			//alert ($("audio").attr('id'));
			//$("audio")[0].pause();
			$("audio").each(function() {
				$('.AudioPlay').removeClass('AudioPause');
				$(this)[0].pause();
			});
			//cancel animations
			$('.audio11_sound').css({
				'-webkit-animation-play-state':'paused',
				'-moz-animation-play-state':'paused',
				'-ms-animation-play-state':'paused',
				'-o-animation-play-state':'paused',
				'animation-play-state':'paused'
			});
			$('.audio11_sound2').css({
				'-webkit-animation-play-state':'paused',
				'-moz-animation-play-state':'paused',
				'-ms-animation-play-state':'paused',
				'-o-animation-play-state':'paused',
				'animation-play-state':'paused'
			});
		}

		function getFlashMovieObject(movieName) {
		  if (window.document[movieName])
		  {
			  return window.document[movieName];
		  }
		  if (navigator.appName.indexOf("Microsoft Internet")==-1)
		  {
			if (document.embeds && document.embeds[movieName])
			  return document.embeds[movieName];
		  }
		  else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
		  {
			return document.getElementById(movieName);
		  }
		}


		function getInternetExplorerVersion()
		// -1 - not IE
		// 7,8,9 etc
		{
		   var rv = -1; // Return value assumes failure.
		   if (navigator.appName == 'Microsoft Internet Explorer')
		   {
			  var ua = navigator.userAgent;
			  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			  if (re.exec(ua) != null)
				 rv = parseFloat( RegExp.$1 );
		   }
		   else if (navigator.appName == 'Netscape')
		   {
			 var ua = navigator.userAgent;
			 var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			 if (re.exec(ua) != null)
			   rv = parseFloat( RegExp.$1 );
		   }
		   return parseInt(rv,10);
		}


		function it_supports_mp3(current_obj) {
			  var to_retun=false;
			  if (!(!!(document.getElementById(current_obj.audioID).canPlayType) && ("no" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")) && ("" != document.getElementById(current_obj.audioID).canPlayType("audio/mpeg")))) {
				  to_retun=true;
			  }
			  /*var v = document.getElementById(current_obj.audioID);
			  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');*/
			  return to_retun;
		}

		function hexToRgb(hex) {
			  if (hex.indexOf("#")!=-1) {
					hex=hex.substring(1);
				}
		    var bigint = parseInt(hex, 16);
		    var r = (bigint >> 16) & 255;
		    var g = (bigint >> 8) & 255;
		    var b = bigint & 255;

		    return r + "," + g + "," + b;
		}



	//core
	$.fn.audio11_html5 = function(options) {

		var options = $.extend({},$.fn.audio11_html5.defaults, options);
		var ver_ie=getInternetExplorerVersion();
		//parse it
		return this.each(function() {
			var audio11_html5_Audio = $(this);


			//the controllers
			var audio11_html5_controlsDef = $('<div class="ximg_frame"></div>  <a class="AudioPlay" title="Play/Pause"></a>   <div class="thumbsHolderWrapper"><div class="historyPadding"><div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div></div></div>');

			var audio11_html5_the_bars=$('<div class="audio11_barsContainer"><div class="audio11_bars perspectiveDownZero"><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div><div class="audio11_bar audio11_sound2"></div></div><div class="audio11_bars"><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div><div class="audio11_bar audio11_sound"></div></div></div>');


			//the elements
			var audio11_html5_container = audio11_html5_Audio.parent('.audio11_html5');

			/*audio11_html5_container.addClass(options.skin);*/
			audio11_html5_container.append(audio11_html5_controlsDef);
			audio11_html5_container.append(audio11_html5_the_bars);

			$('.audio11_bar', audio11_html5_container).css({
				'background':options.barsColor
			});


			var audio11_html5_play_btn = $('.AudioPlay', audio11_html5_container);
			var audio11_html5_ximg_frame = $('.ximg_frame', audio11_html5_container);

			audio11_html5_container.wrap("<div class='audio11_html5_the_wrapper'></div>");
			var audio11_html5_the_wrapper = audio11_html5_container.parent();
			if (options.width100Proc) {
						options.playerWidth=audio11_html5_the_wrapper.parent().width();
						if (options.sticky) {
								options.playerWidth=$(window).width();
						}
			}
			audio11_html5_the_wrapper.width(options.playerWidth);
			audio11_html5_the_wrapper.css({
				'border-width':options.borderWidth+'px',
				'border-color':options.borderColor,
				'background-color':'rgb('+hexToRgb(options.bgColor)+','+options.bgColorOpacity+')'
			});
			if (options.sticky) {
				audio11_html5_the_wrapper.addClass('audio11_html5_sticky');
			}

			//center plugin
			if (options.centerPlayer) {
				audio11_html5_the_wrapper.css({
					"margin":"0 auto"
				});
			}

			var ver_ie=getInternetExplorerVersion();

			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || navigator.userAgent.indexOf('Android') != -1) {
				options.autoPlay=false;
			}

			var randNo=Math.floor(Math.random()*100000);
			var current_obj = {
				playerWidth:options.playerWidth,
				title_arr:[],
				artist_arr:[],
				time_arr:[],
				image_arr:[],
				thumbsHolder_Thumb:$('<div class="thumbsHolder_ThumbOFF" rel="0"><div class="padding">test</div></div>'),
				thumbsHolder_ThumbHeight:80,
				thumbsHolder_Thumbs:'',
				positionElementsForActiveRecord_timeout:'',
				activeRecordId:0,
				activeRecordMarginBottom:15,
				barsCurDisplay:'block',
				historyRecordTitleLimit:options.historyRecordTitleLimit,
				historyRecordAuthorLimit:options.historyRecordAuthorLimit,
				titleLimitAddition:options.titleLimitAddition,
				authorLimitAddition:options.authorLimitAddition,
				playButAddtionalRightMargin:options.playButAddtionalRightMargin,
				playBtnHeight:56,

				historyLeftPadding:options.historyLeftPadding,
				historyRightPadding:options.historyRightPadding,

				songTitleFontSize:options.songTitleFontSize,
				songTitleHeight:options.songTitleHeight,
				songAuthorHeight:options.songAuthorHeight,


				isFlashNeeded:true,
				myFlashObject:'',

				myregexp:/^(http|https):\/\/(.*):(.*)\/(.*)$/,
				http_or_https:'http',
				ip:'',
				port:'',
				mount_point:'',
				history_arr:['played.html'],

				radioReaderAjaxInterval:'',
				barsDisplayTimeout:0,


				the_artist_id:'',
				the_wikidata_id:'',
				musicbrainz_setTimeout:'',
				musicbrainzHistory_setTimeout_arr:[''],

				the_artist_id_history_arr:[''],
				the_wikidata_id_history_arr:[''],
				wiki_photo_path:'',
				html5_audio_tag:'',
				audioID:'clever_audio_tag_id_'+randNo
			};


			//current_obj.audioID=audio11_html5_Audio.attr('id');
			current_obj.html5_audio_tag=$('<audio id="'+current_obj.audioID+'" preload="metadata"></audio>');
			audio11_html5_container.append(current_obj.html5_audio_tag);

			if (options.nowPlayingInterval<35) {
					options.nowPlayingInterval=40;
			}

			if (options.numberOfElementsDisplayed<1) {
				options.numberOfElementsDisplayed=1;
			}

			//chrome and safari on mac auto-play restrictions 2018 start + firefox 2019 start
			//alert (navigator.vendor+'  ---  '+navigator.platform+'  ---  '+navigator.userAgent);
			if ((navigator.userAgent.indexOf("Opera")==-1 &&  navigator.userAgent.indexOf('OPR')) == -1  ) {  // is NOT Opera
						if (navigator.userAgent.indexOf("Chrome")!=-1 && navigator.vendor.indexOf('Google')!=-1 ) { //is chrome
								options.autoPlay=false;
								//alert ('is chrome');
						}
						if (navigator.userAgent.indexOf('Firefox') > -1) {
								options.autoPlay=false;
								//alert ('is firefox');
						}
						if (navigator.userAgent.indexOf("Safari")!=-1 && navigator.vendor.indexOf('Apple')!=-1 && navigator.platform.indexOf('Win')==-1) { //is safari on mac
							options.autoPlay=false;
							//alert ('is safari');
						}
			}
			//chrome and safari on mac auto-play restrictions 2018 end + firefox 2019 start

			if (options.autoPlay==false) {
					pauseBarsAnimation(options,current_obj,audio11_html5_container);
			}

			current_obj.isFlashNeeded=it_supports_mp3(current_obj);
			if (ver_ie!=-1) {
				//if (ver_ie!=9) {
					current_obj.isFlashNeeded=true;
				//}
			}
			current_obj.isFlashNeeded=false;
			//alert (current_obj.isFlashNeeded);

			//initialize first Audio
			if (options.radio_stream.indexOf("/",9)==-1) {
				options.radio_stream=options.radio_stream+'/;';
			}
			if (options.radio_stream.charAt(options.radio_stream.length - 1)=='/') {
				options.radio_stream=options.radio_stream+';';
			}
			var matches;
			matches = options.radio_stream.match(current_obj.myregexp);
			if (matches!=null) {
				current_obj.http_or_https=matches[1];
				current_obj.ip=matches[2];
				//alert (current_obj.http_or_https);
				current_obj.port=matches[3];
				current_obj.mount_point=matches[4];
					if (current_obj.mount_point!=undefined && current_obj.mount_point.trim()==';') {
						current_obj.mount_point='';
					}
			}
			if (current_obj.isFlashNeeded) {
					//flash fallback
					current_obj.rndNum=parseInt(Math.random() * (999999 - 1000) + 1000);
					audio11_html5_container.append("<div id='swfHolder"+current_obj.rndNum+"'></div>");
					var fn = function() {
						var att = { data:options.pathToAjaxFiles+"flash_player.swf", width:"0", height:"0" };
						var par = { flashvars:"streamUrl="+options.radio_stream+"&autoPlay="+options.autoPlay+"&initialVolume="+1 };
						var id = "swfHolder"+current_obj.rndNum;
						current_obj.myFlashObject = swfobject.createSWF(att, par, id);
						//alert (current_obj.rndNum+'  --  '+current_obj.myFlashObject);
					};
					swfobject.addDomLoadEvent(fn);
					//flash fallback
					if (options.autoPlay) {
							audio11_html5_play_btn.addClass('AudioPause');
					}
			}

			if (!current_obj.isFlashNeeded) {
				document.getElementById(current_obj.audioID).src=options.radio_stream;
				document.getElementById(current_obj.audioID).load();
				if (options.autoPlay) {
					audio11_html5_play_btn.click();
				}
			} else {
				if (current_obj.myFlashObject!='') {
					setTimeout(function(){
								current_obj.myFlashObject.myAS3function(options.radio_stream,1);
					}, 1000);
				}
			}
			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
					audio11_html5_play_btn.removeClass('AudioPause');
			}
			//initialize first Audio END

			//generate history
			var audio11_html5_thumbsHolderWrapper = $('.thumbsHolderWrapper', audio11_html5_container);
			var audio11_html5_historyPadding = $('.historyPadding', audio11_html5_container);
			var audio11_html5_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', audio11_html5_container);
			var audio11_html5_thumbsHolder = $('.thumbsHolder', audio11_html5_container);
			//get current
			var startPoint;
			var lengthPoint;
			var history_aux_arr;
			var history_record_aux_arr;
			var history_temp_str;
			var i = 0;
			//$.get( options.pathToAjaxFiles+"history.php", {the_stream:current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.history_arr[0],'_': $.now()}, function( data ) {
			// $.get( options.pathToAjaxFiles+"now_playing.php", {the_stream:options.radio_stream,'_': $.now()}, function( data ) {
			// 				///console.log("now_playing:"+data);
			// 				///data='A-Ha - Turn on Me';
			// 				var data_temp=data.split("-");
			// 				if (data_temp[0]===undefined) {
			// 					data_temp[0]='';
			// 				}
			// 				if (data_temp[1]===undefined) {
			// 					data_temp[1]='';
			// 				}

			// 				if (data_temp.length>=3) {
			// 						data_temp[0]=data_temp[0]+'-'+data_temp[1];
			// 						data_temp[1]=data_temp[2];
			// 				}
			// 				//console.log($("song", data).attr('title'));
			// 				current_obj.title_arr.push( data_temp[1].trim() );
			// 				current_obj.artist_arr.push( data_temp[0].trim() );
			// 				current_obj.time_arr.push( 'now:0:0' );
			// 				current_obj.image_arr.push( options.noImageAvailable );
			// 				//get history
			// 				////console.log('the stream: '+current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.history_arr[0]);
			// 				$.get( options.pathToAjaxFiles+"history.php", {the_stream:current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.history_arr[0],'_': $.now(),the_optional_history_path:options.optional_history_path}, function( result ) {
			// 							//console.log('the stream: '+current_obj.http_or_https+'://'+current_obj.ip+':'+current_obj.port+'/'+current_obj.history_arr[0]);
			// 							//console.log("history: "+result);
			// 							//alert ("result: "+result);

			// 							if (options.optional_history_path=='') {
			// 										if (result.indexOf("Current Song")!=-1) {
			// 											startPoint=result.indexOf("Current Song")+12;
			// 											lengthPoint=result.length;
			// 											result=result.substr(startPoint,lengthPoint);
			// 											//alert ("result: "+result);
			// 											///console.log("history2: "+result);
			// 											////history_aux_arr= result.split("</td><td>");
			// 											history_aux_arr= result.split("<tr><td>");
			// 											history_aux_arr.shift();
			// 											for (var i = 0; i < history_aux_arr.length; i++) {
			// 												///console.log('orig: '+history_aux_arr[i]);
			// 												history_record_aux_arr=history_aux_arr[i].split("</td><td>");
			// 												startPoint=String(history_record_aux_arr[1]).indexOf("</");
			// 												if (startPoint!=-1) {
			// 												 lengthPoint=startPoint;
			// 												 history_record_aux_arr[1] = history_record_aux_arr[1].substr(0,lengthPoint);
			// 												 history_record_aux_arr[1] = history_record_aux_arr[1].replace(/<\/?[^>]+(>|$)/g, "");
			// 												 //alert (history_aux_arr[i]);
			// 													if (history_record_aux_arr[1]!='' && history_record_aux_arr[1]!='Empty Title'  && history_record_aux_arr[1]!='ROCK RADIO - CISTI ROCK! - www.rockradio.si') {
			// 														history_temp_str=history_record_aux_arr[1].split('-');
			// 														if (history_temp_str[0]===undefined) {
			// 															history_temp_str[0]='';
			// 														}
			// 														if (history_temp_str[1]===undefined) {
			// 															history_temp_str[1]='';
			// 														}
			// 														/*console.log(history_record_aux_arr[1]);
			// 														console.log(history_record_aux_arr[0].trim()+'   --   '+history_temp_str[0].trim()+'   --   '+history_temp_str[1].trim());
			// 														console.log('------------------------------------------------------');*/
			// 														current_obj.title_arr.push( history_temp_str[1].trim() );
			// 														current_obj.artist_arr.push( history_temp_str[0].trim() );
			// 														current_obj.time_arr.push( history_record_aux_arr[0].trim() );
			// 														current_obj.image_arr.push( options.noImageAvailable );
			// 													}
			// 												}

			// 											}

			// 											/*current_obj.title_arr=current_obj.title_arr.slice(Math.max(current_obj.title_arr.length - options.numberOfElementsDisplayed, 1));
			// 											current_obj.artist_arr=current_obj.artist_arr.slice(Math.max(current_obj.artist_arr.length - options.numberOfElementsDisplayed, 1));
			// 											current_obj.time_arr=current_obj.time_arr.slice(Math.max(current_obj.time_arr.length - options.numberOfElementsDisplayed, 1));
			// 											current_obj.image_arr=current_obj.image_arr.slice(Math.max(current_obj.image_arr.length - options.numberOfElementsDisplayed, 1));*/
			// 											current_obj.title_arr=current_obj.title_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 											current_obj.artist_arr=current_obj.artist_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 											current_obj.time_arr=current_obj.time_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 											current_obj.image_arr=current_obj.image_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 											//current_obj.playlist_arr=history_aux_arr;
			// 											//alert (history_aux_arr+'   ---   '+current_obj.playlist_arr[0]);
			// 										}
			// 						} else {
			// 										/*console.log("history: "+result);
			// 										console.log('------------------------------------------------------');
			// 										console.log('------------------------------------------------------');*/
			// 										var obj_json = JSON.parse(result);
			// 										var the_k=0
			// 										var author_arr=new Array();
			// 										var temp_date;
			// 										var temp_hours;
			// 										var temp_minutes;
			// 										var temp_seconds
			// 										//console.log("aa:"+obj_json.items+'   ----  '+Object.keys(obj_json.items).length+'   ----  '+obj_json.items[0].title);
			// 										if (obj_json.items instanceof Array) {
			// 													while (the_k < Object.keys(obj_json.items).length) {
			// 																author_arr=obj_json.items[the_k].title.split('-');
			// 																author_arr[0]=author_arr[0].trim();
			// 																/*if (author_arr.length>2) {
			// 																	author_arr[0]=author_arr[0].trim()+'-'+author_arr[1].trim();
			// 																	author_arr[1]=author_arr[2].trim();
			// 																}*/

			// 																temp_date= new Date(obj_json.items[the_k].date * 1000);
			// 																// Hours part from the timestamp
			// 																temp_hours = temp_date.getHours();
			// 																// Minutes part from the timestamp
			// 																temp_minutes = "0" + temp_date.getMinutes();
			// 																// Seconds part from the timestamp
			// 																temp_seconds = "0" + temp_date.getSeconds();

			// 																if (the_k===0 & current_obj.title_arr[0]==author_arr[1] && current_obj.artist_arr[0]==author_arr[0]) {
			// 																	//nothing
			// 																} else {
			// 																		current_obj.title_arr.push( author_arr[1] );
			// 																		current_obj.artist_arr.push( author_arr[0] );
			// 																		current_obj.time_arr.push( temp_hours + ':' + temp_minutes.substr(-2) + ':' + temp_seconds.substr(-2) );
			// 																		current_obj.image_arr.push( options.noImageAvailable );
			// 																}

			// 																the_k++;
			// 													}
			// 													//remove first song from history because is the same as the current song
			// 													/*current_obj.title_arr.shift();
			// 													current_obj.artist_arr.shift();
			// 													current_obj.time_arr.shift();
			// 													current_obj.image_arr.shift();*/

			// 													// limit the hsotory to numberOfElementsDisplayed
			// 													current_obj.title_arr=current_obj.title_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 													current_obj.artist_arr=current_obj.artist_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 													current_obj.time_arr=current_obj.time_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 													current_obj.image_arr=current_obj.image_arr.slice(0,Math.min(options.numberOfElementsDisplayed, current_obj.artist_arr.length));
			// 										}
			// 						}

			// 						current_obj.time_arr[0]=getCurentSongTime(options,current_obj);
			// 						generateHistory(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding);
			// 						for (var i=0; i<current_obj.title_arr.length; i++) {
			// 									generateHistoryImages(options,current_obj,audio11_html5_container,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,audio11_html5_play_btn,i);
			// 						}

			// 						current_obj.radioReaderAjaxInterval=setInterval(function(){
			// 								get_now_playing(options,current_obj,audio11_html5_container,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars);
			// 						},options.nowPlayingInterval*1000);

			// 				});

			// 				/////generateHistory(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding);
			// });


					audio11_html5_play_btn.on( "mouseover", function() {
										audio11_html5_play_btn.css({
												'border-left-color':options.playButtonHoverColor,
												'border-right-color':options.playButtonHoverColor
										});
					});

					audio11_html5_play_btn.on( "mouseout", function() {
								audio11_html5_play_btn.css({
										'border-left-color':options.playButtonColor,
										'border-right-color':options.playButtonColor
								});
					});




					//buttons start
					audio11_html5_play_btn.on( "click", function() {
							var is_paused;
							if (current_obj.isFlashNeeded) {
								is_paused=!audio11_html5_play_btn.hasClass('AudioPause');
							} else {
								is_paused=document.getElementById(current_obj.audioID).paused;
							}
							cancelAll();
							if (is_paused == false) {
								if (!current_obj.isFlashNeeded) {
									document.getElementById(current_obj.audioID).pause();
								} else {
									current_obj.myFlashObject.myAS3function("_pause_radio_stream_",1);
								}
								audio11_html5_play_btn.removeClass('AudioPause');
								pauseBarsAnimation(options,current_obj,audio11_html5_container);
							} else {
								if (!current_obj.isFlashNeeded) {
									//v 1.5.0
									document.getElementById(current_obj.audioID).src=options.radio_stream;
									document.getElementById(current_obj.audioID).load();
									//v 1.5.0
									document.getElementById(current_obj.audioID).play();
									//alert ("play");
								} else {
									current_obj.myFlashObject.myAS3function("_play_radio_stream_",1);
								}
								audio11_html5_play_btn.addClass('AudioPause');
								playBarsAnimation(options,current_obj,audio11_html5_container)
							}
							//alert (document.getElementById(current_obj.audioID).paused);
					});


			var doResize = function() {
					var responsiveWidth=audio11_html5_the_wrapper.parent().width();
					if (options.sticky && options.width100Proc) {
							responsiveWidth=$(window).width();
					}
					//console.log(responsiveWidth+ '   <    '+options.playerWidth);
					if (responsiveWidth<options.playerWidth || current_obj.playerWidth!=options.playerWidth || options.width100Proc) {
							if (responsiveWidth<options.playerWidth || options.width100Proc) {
									current_obj.playerWidth=responsiveWidth-2*options.borderWidth;
							} else {
									current_obj.playerWidth=options.playerWidth;
							}
							// start the resizing
							current_obj.songTitleFontSize=options.songTitleFontSize;
							current_obj.songTitleHeight=options.songTitleHeight;
							current_obj.songAuthorHeight=options.songAuthorHeight;
							if ( ((responsiveWidth<options.playerWidth) && !options.width100Proc) || (responsiveWidth-options.historyLeftPadding-options.historyRightPadding)<720) {
								current_obj.historyLeftPadding=15;
								current_obj.historyRightPadding=15;
								if ((responsiveWidth-options.historyLeftPadding-options.historyRightPadding)<500) {
									current_obj.historyLeftPadding=2;
									current_obj.historyRightPadding=2;
									current_obj.songTitleFontSize=14;
									current_obj.songTitleHeight=options.songTitleHeight-4;
									current_obj.songAuthorHeight=options.songAuthorHeight-1;
								}
							} else {
								current_obj.historyLeftPadding=options.historyLeftPadding;
								current_obj.historyRightPadding=options.historyRightPadding;
							}

							audio11_html5_historyPadding.css({
								'padding-left':current_obj.historyLeftPadding+'px',
								'padding-right':current_obj.historyRightPadding+'px'
							});
							audio11_html5_the_wrapper.width(current_obj.playerWidth);

							generateHistory(options,current_obj,audio11_html5_play_btn,audio11_html5_ximg_frame,audio11_html5_the_bars,audio11_html5_thumbsHolder,audio11_html5_thumbsHolderWrapper,audio11_html5_thumbsHolderVisibleWrapper,audio11_html5_historyPadding);
							if (current_obj.playerWidth<700) {
										current_obj.barsCurDisplay='none';
										current_obj.barsDisplayTimeout=1;
							} else {
										current_obj.barsCurDisplay='block';
										if (current_obj.barsDisplayTimeout===0) {
												current_obj.barsDisplayTimeout=1000;
										}
							}
							setTimeout(function(){
										audio11_html5_the_bars.css({
											'display':current_obj.barsCurDisplay
										});
							}, current_obj.barsDisplayTimeout);







					}
			};

			var TO = false;
			$(window).resize(function() {
				var doResizeNow=true;

				if (ver_ie!=-1 && ver_ie==9 && current_obj.windowWidth==0)
					doResizeNow=false;


				if (current_obj.windowWidth==$(window).width()) {
					doResizeNow=false;
					if (options.windowCurOrientation!=window.orientation && navigator.userAgent.indexOf('Android') != -1) {
						options.windowCurOrientation=window.orientation;
						doResizeNow=true;
					}
				} else {
					/*if (current_obj.windowWidth===0 && (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1))
						doResizeNow=false;*/
					current_obj.windowWidth=$(window).width();
				}

				if (options.responsive && doResizeNow) {
					 if(TO !== false)
						clearTimeout(TO);


					 TO = setTimeout(function(){ doResize() }, 300); //300 is time in miliseconds
				}
			});



			if (options.responsive) {
				doResize();
			}



		});
	};


	//
	// plugin customization variables
	//
	$.fn.audio11_html5.defaults = {
			radio_stream:'http://194.232.200.150:80/;',
			historyFile:'', //hidden
			nowPlayingFile:'', //hidden
			nextFile:'', //hidden
			useRadioServerTime:false,

		  playerWidth:760,
			borderWidth:1,
			borderColor:'#bfbfbf',
			bgColor:'#FFFFFF',
			bgColorOpacity:1,
			barsColor:'#FFFFFF',
			playButtonColor:'#FFFFFF',
			playButtonHoverColor:'#d7d7d7',/*d7d7d7*/

			autoPlay:true,
			centerPlayer:true,

			responsive:true, //hidden
			nowPlayingInterval:35,
			grabArtistPhoto:true,
			pathToAjaxFiles:'',
			noImageAvailable:'noimageavailable.jpg',

			historyLeftPadding:25,
			historyRightPadding:25,
			historyTopPadding:30,
			historyBottomPadding:30,
			historyRecordTitleLimit:24 , // removed
			historyRecordAuthorLimit:34, // removed
			titleLimitAddition:8, //hidden
			authorLimitAddition:10, //hidden
			playButAddtionalRightMargin:18,  //hidden
			songTitleFontSize:18, //hidden
			songTitleHeight:28, //hidden
			songAuthorHeight:25, //hidden

			songAuthorLineSeparatorOffColor:"#bfbfbf",
			historyRecordTimeOffColor:"#000000",
			historyRecordSongOffColor:"#000000",
			historyRecordAuthorOffColor:"#575757",

			songAuthorLineSeparatorOnColor:"transparent",
			historyRecordTimeOnColor:"#FFFFFF",
			historyRecordSongOnColor:"#FFFFFF",
			historyRecordAuthorOnColor:"#FFFFFF",
			historyRecordBackgroundOnColor:"#dd0060",

			numberOfElementsDisplayed:6, //new
			sticky:false, //new
			width100Proc:false, //new

			optional_images_path:'',
			optional_history_path:'',

			origWidth:0

	};

})(jQuery);
